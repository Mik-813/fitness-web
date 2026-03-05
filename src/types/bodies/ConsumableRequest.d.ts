interface StoreConsumableRequest {
  title: string
  record_date: string
  weight_g?: number
  consumption_g?: number
  kcal_100g?: number
  carbs_100g?: number
  protein_100g?: number
  fat_100g?: number
  sugar_100g?: number
  fiber_100g?: number
}

interface UpdateConsumableRequest extends Partial<StoreConsumableRequest> { override?: boolean, }
