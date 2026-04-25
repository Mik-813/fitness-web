interface DbExercisesPage {
  success: boolean
  metadata: {
    totalExercises: number
    totalPages: number
    currentPage: number
    previousPage: string
    nextPage: string
  }
  data: DbExercise[]
}

interface DbExercise {
  exerciseId: string
  name: string
  gifUrl: string
  targetMuscles: string[]
  bodyParts: string[]
  equipments: string[]
  secondaryMuscles: string[]
  instructions: string[]
}
