interface ExerciseFilters {
  [key: string]: string | number | undefined
  offset?: number
  limit?: number
  search?: string
  muscles?: string
  equipment?: string
  bodyParts?: string
  sortBy?: Sortings
  sortOrder?: 'asc' | 'desc'
}

type Sortings = 'name'
  | 'exerciseId'
  | 'targetMuscles'
  | 'bodyParts'
  | 'equipments'
  | 'relevance'
