"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Package, 
  Layers, 
  Factory, 
  Truck, 
  TrendingUp,
  IndianRupee
} from "lucide-react"

interface ReportCardsProps {
  stats: {
    totalProducts: number
    totalRawMaterials: number
    completedBatches: number
    totalProduced: number
    totalDispatched: number
    totalStockValue: number
    deliveryRate: string
  }
}

export function ReportCards({ stats }: ReportCardsProps) {
  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Raw Materials",
      value: stats.totalRawMaterials.toLocaleString(),
      icon: Layers,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Completed Batches",
      value: stats.completedBatches.toLocaleString(),
      icon: Factory,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total Units Produced",
      value: stats.totalProduced.toLocaleString(),
      icon: TrendingUp,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Total Units Dispatched",
      value: stats.totalDispatched.toLocaleString(),
      icon: Truck,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      title: "Inventory Value",
      value: `Rs. ${stats.totalStockValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: IndianRupee,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
