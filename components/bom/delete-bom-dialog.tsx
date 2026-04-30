"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"
import type { BillOfMaterial, RawMaterial } from "@/lib/types"

interface DeleteBOMDialogProps {
  bom: BillOfMaterial & { raw_material: RawMaterial }
  productName: string
}

export function DeleteBOMDialog({ bom, productName }: DeleteBOMDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("bill_of_materials")
        .delete()
        .eq("id", bom.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error deleting BOM entry:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="glass-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Material from BOM</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <span className="font-semibold text-foreground">{bom.raw_material.name}</span> from 
            the bill of materials for <span className="font-semibold text-foreground">{productName}</span>? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
