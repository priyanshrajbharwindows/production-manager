import { createClient } from "@/lib/supabase/server"
import { AppHeader } from "@/components/app-header"
import { DispatchTable } from "@/components/dispatch/dispatch-table"
import { NewDispatchDialog } from "@/components/dispatch/new-dispatch-dialog"

async function getDispatchData() {
  const supabase = await createClient()

  const [{ data: dispatches }, { data: batches }] = await Promise.all([
    supabase
      .from("dispatch")
      .select("*, production_batch:production_batches(*, product:products(*))")
      .order("created_at", { ascending: false }),
    supabase
      .from("production_batches")
      .select("*, product:products(*)")
      .in("status", ["in_progress", "completed"])
      .order("created_at", { ascending: false }),
  ])

  return {
    dispatches: dispatches || [],
    batches: batches || [],
  }
}

export default async function DispatchPage() {
  const { dispatches, batches } = await getDispatchData()

  const pendingCount = dispatches.filter(d => d.status === "pending").length
  const inTransitCount = dispatches.filter(d => d.status === "in_transit").length

  return (
    <div className="min-h-screen">
      <AppHeader
        title="Dispatch"
        description="Manage product shipments and deliveries"
      />

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              {dispatches.length} dispatches total
              {pendingCount > 0 && (
                <span className="ml-2 text-warning">
                  ({pendingCount} pending)
                </span>
              )}
              {inTransitCount > 0 && (
                <span className="ml-2 text-primary">
                  ({inTransitCount} in transit)
                </span>
              )}
            </p>
          </div>
          <NewDispatchDialog batches={batches} />
        </div>

        <DispatchTable dispatches={dispatches} />
      </div>
    </div>
  )
}
