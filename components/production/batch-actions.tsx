"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Play, Pause, CheckCircle, XCircle, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { ProductionBatch } from "@/lib/types"

interface BatchActionsProps {
  batch: ProductionBatch
}

export function BatchActions({ batch }: BatchActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [quantityProduced, setQuantityProduced] = useState("")
  const [newStatus, setNewStatus] = useState("")

  const handleUpdateProduction = async () => {
    if (!quantityProduced) return
    setLoading(true)

    try {
      const supabase = createClient()
      const newQuantity = batch.quantity_produced + parseInt(quantityProduced)
      
      const { error } = await supabase
        .from("production_batches")
        .update({ 
          quantity_produced: newQuantity,
          status: newQuantity >= batch.quantity_planned ? "completed" : "in_progress",
          end_date: newQuantity >= batch.quantity_planned ? new Date().toISOString().split("T")[0] : null,
        })
        .eq("id", batch.id)

      if (error) throw error
      
      setQuantityProduced("")
      router.refresh()
    } catch (error) {
      console.error("Error updating production:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async () => {
    if (!newStatus) return
    setLoading(true)

    try {
      const supabase = createClient()
      
      const updateData: Record<string, unknown> = { status: newStatus }
      
      if (newStatus === "in_progress" && !batch.start_date) {
        updateData.start_date = new Date().toISOString().split("T")[0]
      }
      if (newStatus === "completed" || newStatus === "cancelled") {
        updateData.end_date = new Date().toISOString().split("T")[0]
      }
      
      const { error } = await supabase
        .from("production_batches")
        .update(updateData)
        .eq("id", batch.id)

      if (error) throw error
      
      setNewStatus("")
      router.refresh()
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Update Production */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Update Production</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="quantity">Add Produced Quantity</Label>
            <div className="flex gap-2">
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={quantityProduced}
                onChange={(e) => setQuantityProduced(e.target.value)}
                min="1"
                max={batch.quantity_planned - batch.quantity_produced}
                className="glass-input"
              />
              <Button 
                onClick={handleUpdateProduction} 
                disabled={loading || !quantityProduced}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Remaining: {(batch.quantity_planned - batch.quantity_produced).toLocaleString()} units
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Change Status */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Change Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>New Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">
                  <span className="flex items-center gap-2">
                    <Pause className="h-4 w-4" /> Planned
                  </span>
                </SelectItem>
                <SelectItem value="in_progress">
                  <span className="flex items-center gap-2">
                    <Play className="h-4 w-4" /> In Progress
                  </span>
                </SelectItem>
                <SelectItem value="completed">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" /> Completed
                  </span>
                </SelectItem>
                <SelectItem value="cancelled">
                  <span className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" /> Cancelled
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleStatusChange} 
            disabled={loading || !newStatus || newStatus === batch.status}
            className="w-full"
            variant={newStatus === "cancelled" ? "destructive" : "default"}
          >
            Update Status
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {batch.status === "planned" && (
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => {
                setNewStatus("in_progress")
                handleStatusChange()
              }}
              disabled={loading}
            >
              <Play className="h-4 w-4" />
              Start Production
            </Button>
          )}
          {batch.status === "in_progress" && (
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 text-success hover:text-success"
              onClick={() => {
                setNewStatus("completed")
                handleStatusChange()
              }}
              disabled={loading}
            >
              <CheckCircle className="h-4 w-4" />
              Mark as Completed
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
