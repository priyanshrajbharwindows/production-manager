"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle } from "lucide-react"
import type { RawMaterial } from "@/lib/types"

interface RawMaterialsTableProps {
  materials: RawMaterial[]
}

export function RawMaterialsTable({ materials }: RawMaterialsTableProps) {
  return (
    <div className="rounded-xl glass-table overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Material</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Stock Level</TableHead>
            <TableHead className="text-right">Current Stock</TableHead>
            <TableHead className="text-right">Min Level</TableHead>
            <TableHead className="text-right">Unit Cost</TableHead>
            <TableHead className="text-right">Stock Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No raw materials found
              </TableCell>
            </TableRow>
          ) : (
            materials.map((material) => {
              const currentStock = Number(material.current_stock)
              const minStock = Number(material.min_stock_level)
              const stockPercent = minStock > 0 ? (currentStock / minStock) * 100 : 100
              const isLow = currentStock <= minStock
              const isCritical = stockPercent < 50
              const stockValue = currentStock * Number(material.unit_cost)

              return (
                <TableRow key={material.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isLow && <AlertTriangle className="h-4 w-4 text-warning" />}
                      <span className="font-medium">{material.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{material.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 w-32">
                      <Progress 
                        value={Math.min(stockPercent, 100)} 
                        className={`h-2 ${
                          isCritical 
                            ? "[&>div]:bg-destructive" 
                            : isLow 
                              ? "[&>div]:bg-warning" 
                              : "[&>div]:bg-success"
                        }`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {stockPercent.toFixed(0)}% of min
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {currentStock.toFixed(2)} {material.unit}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {minStock.toFixed(2)} {material.unit}
                  </TableCell>
                  <TableCell className="text-right">
                    Rs. {Number(material.unit_cost).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    Rs. {stockValue.toFixed(2)}
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
