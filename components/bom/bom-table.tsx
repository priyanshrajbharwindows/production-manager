"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Package } from "lucide-react"
import type { Product, BillOfMaterial, RawMaterial } from "@/lib/types"

interface BOMTableProps {
  bomByProduct: Record<
    string,
    {
      product: Product
      materials: (BillOfMaterial & { raw_material: RawMaterial })[]
    }
  >
}

export function BOMTable({ bomByProduct }: BOMTableProps) {
  const products = Object.values(bomByProduct)

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-border/50 bg-card p-12 text-center">
        <p className="text-muted-foreground">No bill of materials defined yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {products.map(({ product, materials }) => (
        <Card key={product.id} className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold">{product.name}</p>
                <Badge variant="outline" className="mt-1">
                  {product.sku}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Raw Material</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className="text-right">Quantity per Unit</TableHead>
                  <TableHead className="text-right">Unit Cost</TableHead>
                  <TableHead className="text-right">Cost per Product</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((item) => {
                  const costPerProduct = Number(item.quantity_required) * Number(item.raw_material.unit_cost)
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.raw_material.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.raw_material.code}
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(item.quantity_required).toFixed(3)} {item.raw_material.unit}
                      </TableCell>
                      <TableCell className="text-right">
                        Rs. {Number(item.raw_material.unit_cost).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        Rs. {costPerProduct.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )
                })}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={4} className="font-semibold text-right">
                    Total Material Cost per Unit
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    Rs. {materials.reduce((sum, item) => 
                      sum + Number(item.quantity_required) * Number(item.raw_material.unit_cost), 0
                    ).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
