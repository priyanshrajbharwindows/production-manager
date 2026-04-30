"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import type { Product, RawMaterial } from "@/lib/types"

interface NewBOMDialogProps {
  products: Product[]
  rawMaterials: RawMaterial[]
}

export function NewBOMDialog({ products, rawMaterials }: NewBOMDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    product_id: "",
    raw_material_id: "",
    quantity_required: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("bill_of_materials").insert({
        product_id: formData.product_id,
        raw_material_id: formData.raw_material_id,
        quantity_required: parseFloat(formData.quantity_required),
      })

      if (error) throw error

      setOpen(false)
      setFormData({ product_id: "", raw_material_id: "", quantity_required: "" })
      router.refresh()
    } catch (error) {
      console.error("Error creating BOM entry:", error)
    } finally {
      setLoading(false)
    }
  }

  const selectedMaterial = rawMaterials.find(m => m.id === formData.raw_material_id)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Material to Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add to Bill of Materials</DialogTitle>
            <DialogDescription>
              Link a raw material to a product with required quantity.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="product">Product</Label>
              <Select
                value={formData.product_id}
                onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="material">Raw Material</Label>
              <Select
                value={formData.raw_material_id}
                onValueChange={(value) => setFormData({ ...formData, raw_material_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a raw material" />
                </SelectTrigger>
                <SelectContent>
                  {rawMaterials.map((material) => (
                    <SelectItem key={material.id} value={material.id}>
                      {material.name} ({material.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">
                Quantity Required per Unit
                {selectedMaterial && ` (${selectedMaterial.unit})`}
              </Label>
              <Input
                id="quantity"
                type="number"
                step="0.001"
                placeholder="Enter quantity"
                value={formData.quantity_required}
                onChange={(e) => setFormData({ ...formData, quantity_required: e.target.value })}
                required
                min="0.001"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add to BOM"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
