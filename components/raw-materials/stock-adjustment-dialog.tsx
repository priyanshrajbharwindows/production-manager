"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowUpDown } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import type { RawMaterial } from "@/lib/types"

interface StockAdjustmentDialogProps {
  materials: RawMaterial[]
}

export function StockAdjustmentDialog({ materials }: StockAdjustmentDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    raw_material_id: "",
    transaction_type: "purchase",
    quantity: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const material = materials.find(m => m.id === formData.raw_material_id)
      if (!material) throw new Error("Material not found")

      const quantity = parseFloat(formData.quantity)
      const isAddition = formData.transaction_type === "purchase"
      const newStock = Number(material.current_stock) + (isAddition ? quantity : -quantity)

      // Create transaction record
      const { error: txError } = await supabase.from("raw_material_transactions").insert({
        raw_material_id: formData.raw_material_id,
        transaction_type: formData.transaction_type,
        quantity: isAddition ? quantity : -quantity,
        notes: formData.notes || null,
      })

      if (txError) throw txError

      // Update stock level
      const { error: updateError } = await supabase
        .from("raw_materials")
        .update({ current_stock: newStock })
        .eq("id", formData.raw_material_id)

      if (updateError) throw updateError

      setOpen(false)
      setFormData({
        raw_material_id: "",
        transaction_type: "purchase",
        quantity: "",
        notes: "",
      })
      router.refresh()
    } catch (error) {
      console.error("Error adjusting stock:", error)
    } finally {
      setLoading(false)
    }
  }

  const selectedMaterial = materials.find(m => m.id === formData.raw_material_id)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          Adjust Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Stock Adjustment</DialogTitle>
            <DialogDescription>
              Record a purchase or consumption of raw materials.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="material">Raw Material</Label>
              <Select
                value={formData.raw_material_id}
                onValueChange={(value) => setFormData({ ...formData, raw_material_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((material) => (
                    <SelectItem key={material.id} value={material.id}>
                      {material.name} ({Number(material.current_stock).toFixed(2)} {material.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select
                value={formData.transaction_type}
                onValueChange={(value) => setFormData({ ...formData, transaction_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase (Add Stock)</SelectItem>
                  <SelectItem value="production_consumption">Production (Consume)</SelectItem>
                  <SelectItem value="adjustment">Manual Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">
                Quantity {selectedMaterial && `(${selectedMaterial.unit})`}
              </Label>
              <Input
                id="quantity"
                type="number"
                step="0.001"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                min="0.001"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Enter notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Record Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
