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
import { createClient } from "@/lib/supabase/client"
import type { BillOfMaterial, RawMaterial } from "@/lib/types"

interface EditBOMDialogProps {
  bom: BillOfMaterial & { raw_material: RawMaterial }
}

export function EditBOMDialog({ bom }: EditBOMDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(String(bom.quantity_required))

  useEffect(() => {
    if (open) {
      setQuantity(String(bom.quantity_required))
    }
  }, [open, bom])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("bill_of_materials")
        .update({
          quantity_required: parseFloat(quantity),
        })
        .eq("id", bom.id)

      if (error) throw error

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating BOM:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit BOM Entry</DialogTitle>
            <DialogDescription>
              Update quantity for {bom.raw_material.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Raw Material</Label>
              <div className="glass-input rounded-lg px-3 py-2 text-sm">
                {bom.raw_material.name} ({bom.raw_material.code})
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-quantity">
                Quantity Required per Unit ({bom.raw_material.unit})
              </Label>
              <Input
                id="edit-quantity"
                type="number"
                step="0.001"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="0.001"
                className="glass-input"
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
