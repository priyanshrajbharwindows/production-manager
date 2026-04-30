import { createClient } from "@/lib/supabase/server"
import { AppHeader } from "@/components/app-header"
import { BOMTable } from "@/components/bom/bom-table"
import { NewBOMDialog } from "@/components/bom/new-bom-dialog"

async function getBOMData() {
  const supabase = await createClient()

  const [{ data: bom }, { data: products }, { data: rawMaterials }] = await Promise.all([
    supabase
      .from("bill_of_materials")
      .select("*, product:products(*), raw_material:raw_materials(*)")
      .order("created_at", { ascending: false }),
    supabase.from("products").select("*").order("name"),
    supabase.from("raw_materials").select("*").order("name"),
  ])

  // Group BOM by product
  const bomByProduct = (bom || []).reduce((acc, item) => {
    const productId = item.product_id
    if (!acc[productId]) {
      acc[productId] = {
        product: item.product,
        materials: [],
      }
    }
    acc[productId].materials.push(item)
    return acc
  }, {} as Record<string, { product: typeof bom[0]['product'], materials: typeof bom }>)

  return {
    bomByProduct,
    products: products || [],
    rawMaterials: rawMaterials || [],
  }
}

export default async function BOMPage() {
  const { bomByProduct, products, rawMaterials } = await getBOMData()

  return (
    <div className="min-h-screen">
      <AppHeader
        title="Bill of Materials"
        description="Manage product recipes and material requirements"
      />

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              {Object.keys(bomByProduct).length} products with BOM
            </p>
          </div>
          <NewBOMDialog products={products} rawMaterials={rawMaterials} />
        </div>

        <BOMTable bomByProduct={bomByProduct} />
      </div>
    </div>
  )
}
