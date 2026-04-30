"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet, Package, Layers, Factory, Truck } from "lucide-react"
import type { Product, RawMaterial, ProductionBatch, Dispatch, BillOfMaterial } from "@/lib/types"

interface ExportButtonsProps {
  products: Product[]
  rawMaterials: RawMaterial[]
  batches: (ProductionBatch & { product?: Product })[]
  dispatches: (Dispatch & { production_batch?: ProductionBatch & { product?: Product } })[]
  bom: (BillOfMaterial & { product?: Product; raw_material?: RawMaterial })[]
}

export function ExportButtons({ products, rawMaterials, batches, dispatches, bom }: ExportButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const exportToExcel = (data: Record<string, unknown>[], filename: string, sheetName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.writeFile(workbook, `${filename}.xlsx`)
  }

  const handleExportProducts = () => {
    setLoading("products")
    const data = products.map(p => ({
      "Name": p.name,
      "SKU": p.sku,
      "Description": p.description || "",
      "Unit": p.unit,
      "Created At": new Date(p.created_at).toLocaleDateString(),
    }))
    exportToExcel(data, "products_report", "Products")
    setLoading(null)
  }

  const handleExportRawMaterials = () => {
    setLoading("materials")
    const data = rawMaterials.map(m => ({
      "Name": m.name,
      "Code": m.code,
      "Description": m.description || "",
      "Unit": m.unit,
      "Current Stock": Number(m.current_stock).toFixed(2),
      "Min Stock Level": Number(m.min_stock_level).toFixed(2),
      "Unit Cost (Rs.)": Number(m.unit_cost).toFixed(2),
      "Stock Value (Rs.)": (Number(m.current_stock) * Number(m.unit_cost)).toFixed(2),
    }))
    exportToExcel(data, "raw_materials_report", "Raw Materials")
    setLoading(null)
  }

  const handleExportProduction = () => {
    setLoading("production")
    const data = batches.map(b => ({
      "Batch Number": b.batch_number,
      "Product": b.product?.name || "",
      "SKU": b.product?.sku || "",
      "Quantity Planned": b.quantity_planned,
      "Quantity Produced": b.quantity_produced,
      "Completion %": ((b.quantity_produced / b.quantity_planned) * 100).toFixed(1) + "%",
      "Status": b.status.replace("_", " "),
      "Start Date": b.start_date || "",
      "End Date": b.end_date || "",
      "Notes": b.notes || "",
    }))
    exportToExcel(data, "production_report", "Production Batches")
    setLoading(null)
  }

  const handleExportDispatch = () => {
    setLoading("dispatch")
    const data = dispatches.map(d => ({
      "Dispatch Number": d.dispatch_number,
      "Batch Number": d.production_batch?.batch_number || "",
      "Product": d.production_batch?.product?.name || "",
      "Quantity": d.quantity_dispatched,
      "Destination": d.destination,
      "Dispatch Date": d.dispatch_date,
      "Vehicle Number": d.vehicle_number || "",
      "Driver": d.driver_name || "",
      "Status": d.status.replace("_", " "),
      "Notes": d.notes || "",
    }))
    exportToExcel(data, "dispatch_report", "Dispatches")
    setLoading(null)
  }

  const handleExportBOM = () => {
    setLoading("bom")
    const data = bom.map(b => ({
      "Product": b.product?.name || "",
      "Product SKU": b.product?.sku || "",
      "Raw Material": b.raw_material?.name || "",
      "Material Code": b.raw_material?.code || "",
      "Quantity Required": Number(b.quantity_required).toFixed(3),
      "Unit": b.raw_material?.unit || "",
      "Unit Cost (Rs.)": Number(b.raw_material?.unit_cost || 0).toFixed(2),
      "Cost per Unit (Rs.)": (Number(b.quantity_required) * Number(b.raw_material?.unit_cost || 0)).toFixed(2),
    }))
    exportToExcel(data, "bom_report", "Bill of Materials")
    setLoading(null)
  }

  const handleExportAll = () => {
    setLoading("all")
    
    const workbook = XLSX.utils.book_new()

    // Products sheet
    const productsData = products.map(p => ({
      "Name": p.name,
      "SKU": p.sku,
      "Description": p.description || "",
      "Unit": p.unit,
    }))
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(productsData), "Products")

    // Raw Materials sheet
    const materialsData = rawMaterials.map(m => ({
      "Name": m.name,
      "Code": m.code,
      "Current Stock": Number(m.current_stock).toFixed(2),
      "Unit": m.unit,
      "Unit Cost": Number(m.unit_cost).toFixed(2),
    }))
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(materialsData), "Raw Materials")

    // Production sheet
    const productionData = batches.map(b => ({
      "Batch": b.batch_number,
      "Product": b.product?.name || "",
      "Planned": b.quantity_planned,
      "Produced": b.quantity_produced,
      "Status": b.status,
    }))
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(productionData), "Production")

    // Dispatch sheet
    const dispatchData = dispatches.map(d => ({
      "Dispatch #": d.dispatch_number,
      "Batch": d.production_batch?.batch_number || "",
      "Quantity": d.quantity_dispatched,
      "Destination": d.destination,
      "Status": d.status,
    }))
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(dispatchData), "Dispatch")

    // BOM sheet
    const bomData = bom.map(b => ({
      "Product": b.product?.name || "",
      "Material": b.raw_material?.name || "",
      "Quantity": Number(b.quantity_required).toFixed(3),
    }))
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(bomData), "BOM")

    XLSX.writeFile(workbook, "nexus_complete_report.xlsx")
    setLoading(null)
  }

  const reports = [
    {
      id: "products",
      title: "Products Report",
      description: "Export all products with details",
      icon: Package,
      onClick: handleExportProducts,
    },
    {
      id: "materials",
      title: "Raw Materials Report",
      description: "Export inventory with stock values",
      icon: Layers,
      onClick: handleExportRawMaterials,
    },
    {
      id: "production",
      title: "Production Report",
      description: "Export all production batches",
      icon: Factory,
      onClick: handleExportProduction,
    },
    {
      id: "dispatch",
      title: "Dispatch Report",
      description: "Export all dispatch records",
      icon: Truck,
      onClick: handleExportDispatch,
    },
    {
      id: "bom",
      title: "Bill of Materials Report",
      description: "Export product recipes and costs",
      icon: FileSpreadsheet,
      onClick: handleExportBOM,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => {
          const Icon = report.icon
          return (
            <Card key={report.id} className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-5 w-5 text-primary" />
                  {report.title}
                </CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={report.onClick}
                  disabled={loading === report.id}
                >
                  <Download className="h-4 w-4" />
                  {loading === report.id ? "Exporting..." : "Export Excel"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Complete Report
          </CardTitle>
          <CardDescription>
            Export all data in a single Excel file with multiple sheets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="gap-2"
            onClick={handleExportAll}
            disabled={loading === "all"}
          >
            <Download className="h-4 w-4" />
            {loading === "all" ? "Exporting..." : "Export Complete Report"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
