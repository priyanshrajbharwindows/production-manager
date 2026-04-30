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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import type { ProductionBatch } from "@/lib/types"

interface EditBatchDialogProps {
  batch: ProductionBatch & { product?: { name: string; sku: string } }
  trigger?: React.ReactNode
}

export function EditBatchDialog({ batch, trigger }: EditBatchDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    batch_number: batch.batch_number,
    quantity_planned: String(batch.quantity_planned),
    quantity_produced: String(batch.quantity_produced),
    status: batch.status,
    start_date: batch.start_date || "",
    end_date: batch.end_date || "",
    notes: batch.notes || "",
  })

  useEffect(() => {
    if (open) {
      setFormData({
        batch_number: batch.batch_number,
        quantity_planned: String(batch.quantity_planned),
        quantity_produced: String(batch.quantity_produced),
        status: batch.status,
        start_date: batch.start_date || "",
        end_date: batch.end_date || "",
        notes: batch.notes || "",
      })
    }
  }, [open, batch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("production_batches")
        .update({
          batch_number: formData.batch_number,
          quantity_planned: parseInt(formData.quantity_planned),
          quantity_produced: parseInt(formData.quantity_produced),
          status: formData.status,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          notes: formData.notes || null,
        })
        .eq("id", batch.id)

      if (error) throw error

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating batch:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Production Batch</DialogTitle>
            <DialogDescription>
              Update batch details for {batch.product?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-batch-number">Batch Number</Label>
                <Input
                  id="edit-batch-number"
                  placeholder="e.g., BATCH-001"
                  value={formData.batch_number}
                  onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                  required
                  className="glass-input"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as ProductionBatch["status"] })}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-quantity-planned">Quantity Planned</Label>
                <Input
                  id="edit-quantity-planned"
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
                <Label htmlFor="edit-quantity-produced">Quantity Produced</Label>
                <Input
                  id="edit-quantity-produced"
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantity_produced}
                  onChange={(e) => setFormData({ ...formData, quantity_produced: e.target.value })}
                  required
                  min="0"
                  className="glass-input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-start-date">Start Date</Label>
                <Input
                  id="edit-start-date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="glass-input"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-end-date">End Date</Label>
                <Input
                  id="edit-end-date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="glass-input"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Notes (Optional)</Label>
              <Textarea
                id="edit-notes"
                placeholder="Add any notes about this batch..."
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
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
