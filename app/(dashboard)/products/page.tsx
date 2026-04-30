import { createClient } from "@/lib/supabase/server"
import { AppHeader } from "@/components/app-header"
import { ProductsTable } from "@/components/products/products-table"
import { NewProductDialog } from "@/components/products/new-product-dialog"

async function getProducts() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("name")

  return products || []
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen">
      <AppHeader
        title="Products"
        description="Manage your finished products catalog"
      />

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              {products.length} products total
            </p>
          </div>
          <NewProductDialog />
        </div>

        <ProductsTable products={products} />
      </div>
    </div>
  )
}
