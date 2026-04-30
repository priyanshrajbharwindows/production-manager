import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppHeader } from "@/components/app-header"
import { BatchDetails } from "@/components/production/batch-details"
import { BatchActions } from "@/components/production/batch-actions"

interface BatchPageProps {
  params: Promise<{ id: string }>
}

async function getBatchData(id: string) {
  const supabase = await createClient()

  const { data: batch, error } = await supabase
    .from("production_batches")
    .select("*, product:products(*)")
    .eq("id", id)
    .single()

  if (error || !batch) {
    return null
  }

  // Get BOM for this product
  const { data: bom } = await supabase
    .from("bill_of_materials")
    .select("*, raw_material:raw_materials(*)")
    .eq("product_id", batch.product_id)

  // Get dispatches for this batch
  const { data: dispatches } = await supabase
    .from("dispatch")
    .select("*")
    .eq("production_batch_id", id)
    .order("created_at", { ascending: false })

  return {
    batch,
    bom: bom || [],
    dispatches: dispatches || [],
  }
}

export default async function BatchPage({ params }: BatchPageProps) {
  const { id } = await params
  const data = await getBatchData(id)

  if (!data) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <AppHeader
        title={data.batch.batch_number}
        description={data.batch.product?.name || "Production Batch"}
      />

      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <BatchDetails batch={data.batch} bom={data.bom} dispatches={data.dispatches} />
          </div>
          <div>
            <BatchActions batch={data.batch} />
          </div>
        </div>
      </div>
    </div>
  )
}
