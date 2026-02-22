interface StoreConsumableRequest {
  record_date: string
  consumption_g: number
  weight_g: number
  title: string
  kcal_100g?: number
  carbs_100g?: number
  protein_100g?: number
  fat_100g?: number
  sugar_100g?: number
  fiber_100g?: number
}

interface UpdateConsumableRequest extends Partial<StoreConsumableRequest> { force_recreate?: boolean, }
