"use client"

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
import { EditProductDialog } from "./edit-product-dialog"
import { DeleteProductDialog } from "./delete-product-dialog"
import type { Product } from "@/lib/types"

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <div className="rounded-xl glass-table overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border/30">
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-primary/10 border-primary/30">
                    {product.sku}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[300px] truncate text-muted-foreground">
                  {product.description || "-"}
                </TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(product.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <EditProductDialog product={product} />
                    <DeleteProductDialog product={product} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
