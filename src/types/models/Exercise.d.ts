interface Exercise {
  id: number
  image_url: string
  date: string
  title: string
  muscle: string
  secondary_muscle?: string
  bodypart: string
  equipment: string
  sets: Array<{
    id: number
    prior_rest_seconds: number
    reps_number: number
    weight_kg?: number
  }>
  created_at: string
  updated_at: string
}
