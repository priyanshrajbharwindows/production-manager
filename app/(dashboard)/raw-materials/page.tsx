import { createClient } from "@/lib/supabase/server"
import { AppHeader } from "@/components/app-header"
import { RawMaterialsTable } from "@/components/raw-materials/raw-materials-table"
import { NewMaterialDialog } from "@/components/raw-materials/new-material-dialog"
import { StockAdjustmentDialog } from "@/components/raw-materials/stock-adjustment-dialog"

async function getRawMaterials() {
  const supabase = await createClient()
  const { data: materials } = await supabase
    .from("raw_materials")
    .select("*")
    .order("name")

  return materials || []
}

export default async function RawMaterialsPage() {
  const materials = await getRawMaterials()
  const lowStockCount = materials.filter(m => 
    Number(m.current_stock) <= Number(m.min_stock_level)
  ).length

  return (
    <div className="min-h-screen">
      <AppHeader
        title="Raw Materials"
        description="Manage inventory and stock levels"
      />

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              {materials.length} materials total
              {lowStockCount > 0 && (
                <span className="ml-2 text-warning">
                  ({lowStockCount} low stock)
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <StockAdjustmentDialog materials={materials} />
            <NewMaterialDialog />
          </div>
        </div>

        <RawMaterialsTable materials={materials} />
      </div>
    </div>
  )
}
