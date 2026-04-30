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
import type { ProductionBatch, Product } from "@/lib/types"

interface NewDispatchDialogProps {
  batches: (ProductionBatch & { product?: Product })[]
}

export function NewDispatchDialog({ batches }: NewDispatchDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    production_batch_id: "",
    quantity_dispatched: "",
    destination: "",
    dispatch_date: new Date().toISOString().split("T")[0],
    vehicle_number: "",
    driver_name: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      
      // Generate dispatch number
      const now = new Date()
      const dispatchNumber = `DSP-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`

      const { error } = await supabase.from("dispatch").insert({
        dispatch_number: dispatchNumber,
        production_batch_id: formData.production_batch_id,
        quantity_dispatched: parseInt(formData.quantity_dispatched),
        destination: formData.destination,
        dispatch_date: formData.dispatch_date,
        vehicle_number: formData.vehicle_number || null,
        driver_name: formData.driver_name || null,
        notes: formData.notes || null,
        status: "pending",
      })

      if (error) throw error

      setOpen(false)
      setFormData({
        production_batch_id: "",
        quantity_dispatched: "",
        destination: "",
        dispatch_date: new Date().toISOString().split("T")[0],
        vehicle_number: "",
        driver_name: "",
        notes: "",
      })
      router.refresh()
    } catch (error) {
      console.error("Error creating dispatch:", error)
    } finally {
      setLoading(false)
    }
  }

  const selectedBatch = batches.find(b => b.id === formData.production_batch_id)
  const availableQuantity = selectedBatch 
    ? selectedBatch.quantity_produced 
    : 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Dispatch
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Dispatch</DialogTitle>
            <DialogDescription>
              Schedule a new product dispatch.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="batch">Production Batch</Label>
              <Select
                value={formData.production_batch_id}
                onValueChange={(value) => setFormData({ ...formData, production_batch_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.batch_number} - {batch.product?.name} ({batch.quantity_produced} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantity_dispatched}
                  onChange={(e) => setFormData({ ...formData, quantity_dispatched: e.target.value })}
                  required
                  min="1"
                  max={availableQuantity}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dispatch_date">Dispatch Date</Label>
                <Input
                  id="dispatch_date"
                  type="date"
                  value={formData.dispatch_date}
                  onChange={(e) => setFormData({ ...formData, dispatch_date: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="Enter destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="vehicle">Vehicle Number</Label>
                <Input
                  id="vehicle"
                  placeholder="e.g., MH-12-AB-1234"
                  value={formData.vehicle_number}
                  onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="driver">Driver Name</Label>
                <Input
                  id="driver"
                  placeholder="Enter driver name"
                  value={formData.driver_name}
                  onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Enter any notes..."
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
              {loading ? "Creating..." : "Create Dispatch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
