interface StoreExerciseRequest {
  record_date: string
  title: string
  muscle: string
  secondary_muscle?: string
  bodypart: string
  equipment: string
  sets?: Array<{
    prior_rest_seconds: number
    reps_number: number
    weight_kg?: number
  }>
}

interface UpdateExerciseRequest extends Partial<Omit<StoreExerciseRequest, 'sets'>> {
  date?: string
  sets?: Array<{
    prior_rest_seconds: number
    reps_number: number
    weight_kg?: number
  }>
}
