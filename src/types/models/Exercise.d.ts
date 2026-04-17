interface Exercise {
  id: number
  image_url: string
  record_date: string
  title: string
  muscle: string
  secondary_muscle?: string
  bodypart: string
  equipment: string
  sets: Array<ExSet>
  created_at: string
  updated_at: string
}

interface ExSet {
  id: number
  rest_seconds: number
  reps_number: number
  weight_kg?: number
}
