"use client"

import Link from "next/link"
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
import { Progress } from "@/components/ui/progress"
import { Eye, MoreHorizontal, Pencil } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditBatchDialog } from "./edit-batch-dialog"
import type { ProductionBatch } from "@/lib/types"

interface ProductionTableProps {
  batches: (ProductionBatch & { product?: { name: string; sku: string } })[]
}

const statusColors: Record<string, string> = {
  planned: "bg-muted/50 text-muted-foreground border-muted-foreground/30",
  in_progress: "bg-warning/20 text-warning-foreground border-warning/30",
  completed: "bg-success/20 text-success border-success/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
}

export function ProductionTable({ batches }: ProductionTableProps) {
  return (
    <div className="rounded-xl glass-table overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border/30">
            <TableHead>Batch Number</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No production batches found
              </TableCell>
            </TableRow>
          ) : (
            batches.map((batch) => {
              const progress = (batch.quantity_produced / batch.quantity_planned) * 100
              
              return (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.batch_number}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{batch.product?.name || "Unknown"}</p>
                      <p className="text-sm text-muted-foreground">{batch.product?.sku}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Progress value={progress} className="h-2 w-24" />
                      <span className="text-xs text-muted-foreground">
                        {batch.quantity_produced.toLocaleString()} / {batch.quantity_planned.toLocaleString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[batch.status]}>
                      {batch.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {batch.start_date 
                      ? format(new Date(batch.start_date), "MMM d, yyyy")
                      : "-"
                    }
                  </TableCell>
                  <TableCell>
                    {batch.end_date 
                      ? format(new Date(batch.end_date), "MMM d, yyyy")
                      : "-"
                    }
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-dialog">
                        <DropdownMenuItem asChild>
                          <Link href={`/production/${batch.id}`} className="flex items-center gap-2">
                            <Eye className="h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <EditBatchDialog 
                          batch={batch} 
                          trigger={
                            <button className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full">
                              <Pencil className="h-4 w-4" /> Edit Batch
                            </button>
                          }
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
