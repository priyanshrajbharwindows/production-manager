"use client"

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Package, Layers, Truck } from "lucide-react"
import type { ProductionBatch, BillOfMaterial, Dispatch } from "@/lib/types"

interface BatchDetailsProps {
  batch: ProductionBatch & { product?: { name: string; sku: string; unit: string } }
  bom: (BillOfMaterial & { raw_material?: { name: string; code: string; unit: string } })[]
  dispatches: Dispatch[]
}

const statusColors: Record<string, string> = {
  planned: "bg-muted text-muted-foreground",
  in_progress: "bg-warning/20 text-warning-foreground border-warning/30",
  completed: "bg-success/20 text-success border-success/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
}

export function BatchDetails({ batch, bom, dispatches }: BatchDetailsProps) {
  const progress = (batch.quantity_produced / batch.quantity_planned) * 100
  const totalDispatched = dispatches.reduce((sum, d) => sum + d.quantity_dispatched, 0)

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Batch Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Product</p>
              <p className="font-medium">{batch.product?.name}</p>
              <p className="text-sm text-muted-foreground">{batch.product?.sku}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="outline" className={statusColors[batch.status]}>
                {batch.status.replace("_", " ")}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">
                {batch.start_date 
                  ? format(new Date(batch.start_date), "MMMM d, yyyy")
                  : "Not started"
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium">
                {batch.end_date 
                  ? format(new Date(batch.end_date), "MMMM d, yyyy")
                  : "In progress"
                }
              </p>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Production Progress</span>
              <span className="font-medium">
                {batch.quantity_produced.toLocaleString()} / {batch.quantity_planned.toLocaleString()} {batch.product?.unit}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="mt-1 text-sm text-muted-foreground text-right">
              {progress.toFixed(1)}% complete
            </p>
          </div>

          {batch.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="mt-1 text-sm">{batch.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bill of Materials */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-accent" />
            Bill of Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bom.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No BOM defined for this product</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Raw Material</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className="text-right">Per Unit</TableHead>
                  <TableHead className="text-right">Total Required</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bom.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.raw_material?.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.raw_material?.code}
                    </TableCell>
                    <TableCell className="text-right">
                      {Number(item.quantity_required).toFixed(3)} {item.raw_material?.unit}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {(Number(item.quantity_required) * batch.quantity_planned).toFixed(3)} {item.raw_material?.unit}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dispatch History */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-chart-3" />
              Dispatch History
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              {totalDispatched.toLocaleString()} / {batch.quantity_produced.toLocaleString()} dispatched
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dispatches.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No dispatches yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Dispatch #</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dispatches.map((dispatch) => (
                  <TableRow key={dispatch.id}>
                    <TableCell className="font-medium">
                      {dispatch.dispatch_number}
                    </TableCell>
                    <TableCell>{dispatch.destination}</TableCell>
                    <TableCell>
                      {format(new Date(dispatch.dispatch_date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      {dispatch.quantity_dispatched.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[dispatch.status] || ""}>
                        {dispatch.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
