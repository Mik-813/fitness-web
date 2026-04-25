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


type Equipment = 'stepmill machine'
  | 'elliptical machine'
  | 'trap bar'
  | 'tire'
  | 'stationary bike'
  | 'wheel roller'
  | 'smith machine'
  | 'hammer'
  | 'skierg machine'
  | 'roller'
  | 'resistance band'
  | 'bosu ball'
  | 'weighted'
  | 'olympic barbell'
  | 'kettlebell'
  | 'upper body ergometer'
  | 'sled machine'
  | 'ez barbell'
  | 'dumbbell'
  | 'rope'
  | 'barbell'
  | 'band'
  | 'stability ball'
  | 'medicine ball'
  | 'assisted'
  | 'leverage machine'
  | 'cable'
  | 'body weight'

type Bodyparts = 'neck'
    | 'lower arms'
    | 'shoulders'
    | 'cardio'
    | 'upper arms'
    | 'chest'
    | 'lower legs'
    | 'back'
    | 'upper legs'
    | 'waist'

type Muscles = 'shins'
  | 'hands'
  | 'sternocleidomastoid'
  | 'soleus'
  | 'inner thighs'
  | 'lower abs'
  | 'grip muscles'
  | 'abdominals'
  | 'wrist extensors'
  | 'wrist flexors'
  | 'latissimus dorsi'
  | 'upper chest'
  | 'rotator cuff'
  | 'wrists'
  | 'groin'
  | 'brachialis'
  | 'deltoids'
  | 'feet'
  | 'ankles'
  | 'trapezius'
  | 'rear deltoids'
  | 'chest'
  | 'quadriceps'
  | 'back'
  | 'core'
  | 'shoulders'
  | 'ankle stabilizers'
  | 'rhomboids'
  | 'obliques'
  | 'lower back'
  | 'hip flexors'
  | 'levator scapulae'
  | 'abductors'
  | 'serratus anterior'
  | 'traps'
  | 'forearms'
  | 'delts'
  | 'biceps'
  | 'upper back'
  | 'spine'
  | 'cardiovascular system'
  | 'triceps'
  | 'adductors'
  | 'hamstrings'
  | 'glutes'
  | 'pectorals'
  | 'calves'
  | 'lats'
  | 'quads'
  | 'abs'
