import { createClient } from "@/lib/supabase/server"
import { AppHeader } from "@/components/app-header"
import { ReportCards } from "@/components/reports/report-cards"
import { ExportButtons } from "@/components/reports/export-buttons"

async function getReportData() {
  const supabase = await createClient()

  const [
    { data: products },
    { data: rawMaterials },
    { data: batches },
    { data: dispatches },
    { data: bom },
  ] = await Promise.all([
    supabase.from("products").select("*"),
    supabase.from("raw_materials").select("*"),
    supabase.from("production_batches").select("*, product:products(*)"),
    supabase.from("dispatch").select("*, production_batch:production_batches(*, product:products(*))"),
    supabase.from("bill_of_materials").select("*, product:products(*), raw_material:raw_materials(*)"),
  ])

  // Calculate statistics
  const completedBatches = batches?.filter(b => b.status === "completed") || []
  const totalProduced = completedBatches.reduce((sum, b) => sum + b.quantity_produced, 0)
  const deliveredDispatches = dispatches?.filter(d => d.status === "delivered") || []
  const totalDispatched = deliveredDispatches.reduce((sum, d) => sum + d.quantity_dispatched, 0)
  
  const totalStockValue = (rawMaterials || []).reduce(
    (sum, m) => sum + Number(m.current_stock) * Number(m.unit_cost), 0
  )

  return {
    products: products || [],
    rawMaterials: rawMaterials || [],
    batches: batches || [],
    dispatches: dispatches || [],
    bom: bom || [],
    stats: {
      totalProducts: products?.length || 0,
      totalRawMaterials: rawMaterials?.length || 0,
      completedBatches: completedBatches.length,
      totalProduced,
      totalDispatched,
      totalStockValue,
      deliveryRate: batches?.length 
        ? ((deliveredDispatches.length / batches.length) * 100).toFixed(1) 
        : "0",
    },
  }
}

export default async function ReportsPage() {
  const data = await getReportData()

  return (
    <div className="min-h-screen">
      <AppHeader
        title="Reports"
        description="Generate and export production reports"
      />

      <div className="p-6">
        <ReportCards stats={data.stats} />
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Export Reports</h2>
          <ExportButtons 
            products={data.products}
            rawMaterials={data.rawMaterials}
            batches={data.batches}
            dispatches={data.dispatches}
            bom={data.bom}
          />
        </div>
      </div>
    </div>
  )
}
