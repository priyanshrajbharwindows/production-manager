"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Truck, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Dispatch, ProductionBatch, Product } from "@/lib/types"

interface DispatchTableProps {
  dispatches: (Dispatch & { 
    production_batch?: ProductionBatch & { product?: Product } 
  })[]
}

const statusColors: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  in_transit: "bg-warning/20 text-warning-foreground border-warning/30",
  delivered: "bg-success/20 text-success border-success/30",
}

export function DispatchTable({ dispatches }: DispatchTableProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const updateStatus = async (id: string, newStatus: string) => {
    setLoading(id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("dispatch")
        .update({ status: newStatus })
        .eq("id", id)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error updating dispatch:", error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="rounded-xl glass-table overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Dispatch #</TableHead>
            <TableHead>Batch / Product</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dispatches.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                No dispatches found
              </TableCell>
            </TableRow>
          ) : (
            dispatches.map((dispatch) => (
              <TableRow key={dispatch.id}>
                <TableCell className="font-medium">{dispatch.dispatch_number}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{dispatch.production_batch?.batch_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {dispatch.production_batch?.product?.name}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{dispatch.destination}</TableCell>
                <TableCell className="text-right font-medium">
                  {dispatch.quantity_dispatched.toLocaleString()}
                </TableCell>
                <TableCell>
                  {format(new Date(dispatch.dispatch_date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div>
                    <p>{dispatch.vehicle_number || "-"}</p>
                    <p className="text-sm text-muted-foreground">{dispatch.driver_name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[dispatch.status]}>
                    {dispatch.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        disabled={loading === dispatch.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {dispatch.status === "pending" && (
                        <DropdownMenuItem 
                          onClick={() => updateStatus(dispatch.id, "in_transit")}
                          className="flex items-center gap-2"
                        >
                          <Truck className="h-4 w-4" /> Mark In Transit
                        </DropdownMenuItem>
                      )}
                      {dispatch.status === "in_transit" && (
                        <DropdownMenuItem 
                          onClick={() => updateStatus(dispatch.id, "delivered")}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" /> Mark Delivered
                        </DropdownMenuItem>
                      )}
                      {dispatch.status === "delivered" && (
                        <DropdownMenuItem disabled className="text-muted-foreground">
                          Already Delivered
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
