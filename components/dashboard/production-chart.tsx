"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { ProductionBatch } from "@/lib/types"

interface ProductionChartProps {
  batches: (ProductionBatch & { product?: { name: string } })[]
}

export function ProductionChart({ batches }: ProductionChartProps) {
  const chartData = batches.map((batch) => ({
    name: batch.batch_number.replace("BATCH-", ""),
    planned: batch.quantity_planned,
    produced: batch.quantity_produced,
    product: batch.product?.name || "Unknown",
  }))

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Production Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelFormatter={(label) => {
                  const item = chartData.find(d => d.name === label)
                  return item?.product || label
                }}
              />
              <Legend />
              <Bar 
                dataKey="planned" 
                fill="hsl(var(--primary))" 
                name="Planned"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="produced" 
                fill="hsl(var(--accent))" 
                name="Produced"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
