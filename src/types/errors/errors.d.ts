interface ApiError<T extends object | [] | undefined = undefined> {
  message: string
  errors?: T
}

interface ProductError {
  user_id?: string
  title?: string
  kcal_100g?: string
  carbs_100g?: string
  protein_100g?: string
  fat_100g?: string
  sugar_100g?: string
  fiber_100g?: string
}

interface WeightedProductError extends ProductError {
  weight_g?: string
  created_at?: string
  updated_at?: string
}

interface ConsumableError extends WeightedProductError {
  record_date?: string
  consumption_g?: string
  weight_g?: string
  weights_g?: string
}
