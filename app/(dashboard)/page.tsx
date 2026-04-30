import { createClient } from "@/lib/supabase/server"
import { AppHeader } from "@/components/app-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { ProductionChart } from "@/components/dashboard/production-chart"
import { RecentBatches } from "@/components/dashboard/recent-batches"
import { LowStockAlerts } from "@/components/dashboard/low-stock-alerts"
import { DispatchOverview } from "@/components/dashboard/dispatch-overview"

async function getDashboardData() {
  const supabase = await createClient()

  const [
    { count: totalProducts },
    { count: totalRawMaterials },
    { data: activeBatches },
    { data: pendingDispatches },
    { data: lowStockMaterials },
    { data: completedBatches },
    { data: recentBatches },
    { data: recentDispatches },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("raw_materials").select("*", { count: "exact", head: true }),
    supabase.from("production_batches").select("*").eq("status", "in_progress"),
    supabase.from("dispatch").select("*").eq("status", "pending"),
    supabase.from("raw_materials").select("*").filter("current_stock", "lt", supabase.rpc ? 0 : 100),
    supabase.from("production_batches").select("*").eq("status", "completed"),
    supabase.from("production_batches").select("*, product:products(*)").order("created_at", { ascending: false }).limit(5),
    supabase.from("dispatch").select("*, production_batch:production_batches(*, product:products(*))").order("created_at", { ascending: false }).limit(5),
  ])

  // Get low stock materials properly
  const { data: lowStock } = await supabase
    .from("raw_materials")
    .select("*")
  
  const lowStockItems = lowStock?.filter(m => Number(m.current_stock) <= Number(m.min_stock_level)) || []

  return {
    stats: {
      totalProducts: totalProducts || 0,
      totalRawMaterials: totalRawMaterials || 0,
      activeBatches: activeBatches?.length || 0,
      pendingDispatches: pendingDispatches?.length || 0,
      lowStockMaterials: lowStockItems.length,
      completedBatchesThisMonth: completedBatches?.length || 0,
      totalProducedThisMonth: completedBatches?.reduce((sum, b) => sum + (b.quantity_produced || 0), 0) || 0,
      dispatchedThisMonth: recentDispatches?.reduce((sum, d) => sum + (d.quantity_dispatched || 0), 0) || 0,
    },
    recentBatches: recentBatches || [],
    recentDispatches: recentDispatches || [],
    lowStockItems,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="min-h-screen">
      <AppHeader 
        title="Dashboard" 
        description="Overview of your factory production" 
      />
      
      <div className="p-6">
        <DashboardStats stats={data.stats} />
        
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ProductionChart batches={data.recentBatches} />
          <DispatchOverview dispatches={data.recentDispatches} />
        </div>
        
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <RecentBatches batches={data.recentBatches} />
          <LowStockAlerts materials={data.lowStockItems} />
        </div>
      </div>
    </div>
  )
}
