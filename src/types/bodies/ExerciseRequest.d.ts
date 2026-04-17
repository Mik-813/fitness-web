interface StoreExerciseRequest extends Partial<Exercise> {
  record_date: string
  title: string
}

interface UpdateExerciseRequest extends Partial<Omit<StoreExerciseRequest, 'sets'>> {
  record_date?: string
  sets?: Array<ExSet>
}
