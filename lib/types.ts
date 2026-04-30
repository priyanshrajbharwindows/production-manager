export interface Product {
  id: string
  name: string
  sku: string
  description: string | null
  unit: string
  created_at: string
  updated_at: string
}

export interface RawMaterial {
  id: string
  name: string
  code: string
  description: string | null
  unit: string
  current_stock: number
  min_stock_level: number
  unit_cost: number
  created_at: string
  updated_at: string
}

export interface BillOfMaterial {
  id: string
  product_id: string
  raw_material_id: string
  quantity_required: number
  created_at: string
  product?: Product
  raw_material?: RawMaterial
}

export interface ProductionBatch {
  id: string
  batch_number: string
  product_id: string
  quantity_planned: number
  quantity_produced: number
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  start_date: string | null
  end_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
  product?: Product
}

export interface Dispatch {
  id: string
  dispatch_number: string
  production_batch_id: string
  quantity_dispatched: number
  destination: string
  dispatch_date: string
  vehicle_number: string | null
  driver_name: string | null
  notes: string | null
  status: 'pending' | 'in_transit' | 'delivered'
  created_at: string
  updated_at: string
  production_batch?: ProductionBatch
}

export interface RawMaterialTransaction {
  id: string
  raw_material_id: string
  transaction_type: 'purchase' | 'production_consumption' | 'adjustment'
  quantity: number
  reference_id: string | null
  notes: string | null
  created_at: string
  raw_material?: RawMaterial
}

export interface DashboardStats {
  totalProducts: number
  totalRawMaterials: number
  activeBatches: number
  pendingDispatches: number
  lowStockMaterials: number
  completedBatchesThisMonth: number
  totalProducedThisMonth: number
  dispatchedThisMonth: number
}
