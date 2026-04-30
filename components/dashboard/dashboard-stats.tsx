"use client"

import { Card, CardContent } from "@/components/ui/card"
import { 
  Package, 
  Layers, 
  Factory, 
  Truck, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Box
} from "lucide-react"
import type { DashboardStats as Stats } from "@/lib/types"

interface DashboardStatsProps {
  stats: Stats
}

const statCards = [
  {
    key: "totalProducts",
    label: "Total Products",
    icon: Package,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    key: "totalRawMaterials",
    label: "Raw Materials",
    icon: Layers,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    key: "activeBatches",
    label: "Active Batches",
    icon: Factory,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    key: "pendingDispatches",
    label: "Pending Dispatches",
    icon: Truck,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    key: "lowStockMaterials",
    label: "Low Stock Alerts",
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    key: "completedBatchesThisMonth",
    label: "Completed This Month",
    icon: CheckCircle,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    key: "totalProducedThisMonth",
    label: "Units Produced",
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    key: "dispatchedThisMonth",
    label: "Units Dispatched",
    icon: Box,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
] as const

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon
        const value = stats[card.key]
        
        return (
          <Card key={card.key} className="border-border/50">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.bgColor}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {typeof value === "number" ? value.toLocaleString() : value}
                </p>
                <p className="text-sm text-muted-foreground">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
