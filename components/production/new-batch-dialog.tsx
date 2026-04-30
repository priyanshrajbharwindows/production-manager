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
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import type { Product } from "@/lib/types"

interface NewBatchDialogProps {
  products: Product[]
}

export function NewBatchDialog({ products }: NewBatchDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    product_id: "",
    quantity_planned: "",
    start_date: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      
      // Generate batch number
      const now = new Date()
      const batchNumber = `BATCH-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`

      const { error } = await supabase.from("production_batches").insert({
        batch_number: batchNumber,
        product_id: formData.product_id,
        quantity_planned: parseInt(formData.quantity_planned),
        start_date: formData.start_date || null,
        notes: formData.notes || null,
        status: formData.start_date ? "in_progress" : "planned",
      })

      if (error) throw error

      setOpen(false)
      setFormData({ product_id: "", quantity_planned: "", start_date: "", notes: "" })
      router.refresh()
    } catch (error) {
      console.error("Error creating batch:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Batch
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Production Batch</DialogTitle>
            <DialogDescription>
              Create a new production batch for manufacturing.
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
              <Label htmlFor="quantity">Quantity Planned</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity_planned}
                onChange={(e) => setFormData({ ...formData, quantity_planned: e.target.value })}
                required
                min="1"
                className="glass-input"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="start_date">Start Date (Optional)</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="glass-input"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Enter any notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="glass-input min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Batch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
