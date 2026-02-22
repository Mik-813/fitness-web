interface Consumable extends WeightedProduct {
  id: number
  record_date: string
  consumption_g: number
  weight_g: number
  weights_g: number[]
}
