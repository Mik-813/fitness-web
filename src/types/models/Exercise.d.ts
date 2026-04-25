interface Exercise {
  id: number
  record_date: string
  db_exercise_id: string
  exercise: DbExercise
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
