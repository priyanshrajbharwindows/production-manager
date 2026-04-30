"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import type { Product } from "@/lib/types"

interface EditProductDialogProps {
  product: Product
}

export function EditProductDialog({ product }: EditProductDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product.name,
    sku: product.sku,
    description: product.description || "",
    unit: product.unit,
  })

  useEffect(() => {
    if (open) {
      setFormData({
        name: product.name,
        sku: product.sku,
        description: product.description || "",
        unit: product.unit,
      })
    }
  }, [open, product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          sku: formData.sku,
          description: formData.description || null,
          unit: formData.unit,
        })
        .eq("id", product.id)

      if (error) throw error

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating product:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="glass-input"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-sku">SKU</Label>
              <Input
                id="edit-sku"
                placeholder="Enter SKU code"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
                className="glass-input"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-unit">Unit</Label>
              <Input
                id="edit-unit"
                placeholder="e.g., bottles, packets"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
                className="glass-input"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="glass-input min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
