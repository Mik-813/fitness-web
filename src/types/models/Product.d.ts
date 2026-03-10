interface Product {
  user_id: number
  title: string
  kcal_100g?: number
  carbs_100g?: number
  protein_100g?: number
  fat_100g?: number
  sugar_100g?: number
  fiber_100g?: number
  // price?: number
}

type NutrientKey = 'kcal_100g' | 'carbs_100g' | 'protein_100g' | 'fat_100g' | 'sugar_100g' | 'fiber_100g'
