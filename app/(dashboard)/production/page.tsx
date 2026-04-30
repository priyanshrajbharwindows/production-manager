import { createClient } from "@/lib/supabase/server"
import { AppHeader } from "@/components/app-header"
import { ProductionTable } from "@/components/production/production-table"
import { NewBatchDialog } from "@/components/production/new-batch-dialog"

async function getProductionData() {
  const supabase = await createClient()

  const [{ data: batches }, { data: products }] = await Promise.all([
    supabase
      .from("production_batches")
      .select("*, product:products(*)")
      .order("created_at", { ascending: false }),
    supabase.from("products").select("*").order("name"),
  ])

  return {
    batches: batches || [],
    products: products || [],
  }
}

export default async function ProductionPage() {
  const { batches, products } = await getProductionData()

  return (
    <div className="min-h-screen">
      <AppHeader
        title="Production Batches"
        description="Manage and track production batches"
      />

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              {batches.length} batches total
            </p>
          </div>
          <NewBatchDialog products={products} />
        </div>

        <ProductionTable batches={batches} />
      </div>
    </div>
  )
}
