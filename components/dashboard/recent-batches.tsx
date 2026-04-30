"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { ProductionBatch } from "@/lib/types"

interface RecentBatchesProps {
  batches: (ProductionBatch & { product?: { name: string } })[]
}

const statusColors: Record<string, string> = {
  planned: "bg-muted text-muted-foreground",
  in_progress: "bg-warning/20 text-warning-foreground border-warning/30",
  completed: "bg-success/20 text-success border-success/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
}

export function RecentBatches({ batches }: RecentBatchesProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Batches</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/production" className="flex items-center gap-1 text-sm">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {batches.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No batches found</p>
          ) : (
            batches.map((batch) => (
              <div
                key={batch.id}
                className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {batch.batch_number}
                    </span>
                    <Badge variant="outline" className={statusColors[batch.status]}>
                      {batch.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {batch.product?.name || "Unknown Product"}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">
                    {batch.quantity_produced.toLocaleString()} / {batch.quantity_planned.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">units</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
