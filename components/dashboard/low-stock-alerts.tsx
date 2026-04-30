"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowRight } from "lucide-react"
import type { RawMaterial } from "@/lib/types"

interface LowStockAlertsProps {
  materials: RawMaterial[]
}

export function LowStockAlerts({ materials }: LowStockAlertsProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Low Stock Alerts
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/raw-materials" className="flex items-center gap-1 text-sm">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {materials.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No low stock alerts</p>
          ) : (
            materials.slice(0, 5).map((material) => {
              const stockPercent = (Number(material.current_stock) / Number(material.min_stock_level)) * 100
              const isCritical = stockPercent < 50
              
              return (
                <div
                  key={material.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {material.name}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={isCritical 
                          ? "bg-destructive/20 text-destructive border-destructive/30" 
                          : "bg-warning/20 text-warning-foreground border-warning/30"
                        }
                      >
                        {isCritical ? "Critical" : "Low"}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {material.code}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      {Number(material.current_stock).toFixed(1)} {material.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Min: {Number(material.min_stock_level).toFixed(1)} {material.unit}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
