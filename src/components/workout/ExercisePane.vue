<script setup lang="ts">
import { watch, ref } from 'vue'
import HandleIcon from '../icons/HandleIcon.vue'
import { endpoints } from '$src/api/endpoints'
import ClockIcon from '$src/components/icons/ClockIcon.vue'
import FireIcon from '$src/components/icons/FireIcon.vue'
import PlusIcon from '$src/components/icons/PlusIcon.vue'
import XMarkIcon from '$src/components/icons/XMarkIcon.vue'
import Tags from '$src/components/workout/ExerciseTags.vue'
import SetModal from '$src/components/workout/SetModal.vue'
import { customToast } from '$src/utils/custom-toast'
import { showModal } from '$src/utils/show-modal'

const formatRestTime = (seconds: number) => {
  if (!seconds) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const props = defineProps<{ onRemove: (exercise: Exercise) => void, }>()

const exerciseModel = defineModel<Exercise>({ required: true })
const exercise = endpoints.getExercise(exerciseModel.value.id).use(exerciseModel.value, false)
watch(() => exercise.data, (newValue) => {
  if (exerciseModel.value !== newValue) {
    exerciseModel.value = newValue
  }
})

watch(exerciseModel, (newValue) => {
  if (exercise.data !== newValue) {
    exercise.data = newValue
  }
})

async function mutateExercise(prop: Partial<Exercise>) {
  const newData = {
    ...exercise.data,
    ...prop,
  }
  return await exercise.mutate({
    data: newData,
    request: async () => {
      const res = await endpoints.updateExercise(
        exercise.data.id,
        newData,
      ).invoke()
      if (res.error) {
        customToast.error(res.error.message)
      }
      return res
    }, 
    debounce: 500, 
  })
}

function removeSet(set: ExSet) {
  mutateExercise({ sets: exercise.data.sets.filter(s => s !== set) })
}

function mutateSet(setIdx: number, prop: Partial<ExSet>) {
  const newSets = [...exercise.data.sets]
  newSets[setIdx] = {
    ...newSets[setIdx],
    ...prop,
  }
  mutateExercise({ sets: newSets })
}

const draggableRowIndex = ref<number | null>(null)
const draggedIndex = ref<number | null>(null)
const hideDragged = ref(false)
const isSwapping = ref(false)

function setMoved(fromIndex: number, toIndex: number) {
  if (isNaN(fromIndex) || fromIndex === toIndex) return
  
  const newSets = [...exercise.data.sets]
  const [moved] = newSets.splice(fromIndex, 1)
  newSets.splice(toIndex, 0, moved)
  
  mutateExercise({ sets: newSets })
}

function onDragStart(e: DragEvent, index: number) {
  draggedIndex.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
  }
  setTimeout(
    () => {
      hideDragged.value = true
    }, 
    0,
  )
}

function onDragEnter(e: DragEvent, index: number) {
  if (draggedIndex.value === null || draggedIndex.value === index) return
  if (isSwapping.value) return

  setMoved(draggedIndex.value, index)
  draggedIndex.value = index

  isSwapping.value = true
  setTimeout(
    () => {
      isSwapping.value = false
    }, 
    300,
  )
}

function onDragEnd() {
  draggableRowIndex.value = null
  draggedIndex.value = null
  hideDragged.value = false
  isSwapping.value = false
}

function openSetModal(set: ExSet, index: number, initialFocus?: 'weight' | 'reps' | 'rest') {
  showModal(
    SetModal, 
    {
      set,
      initialFocus,
      onWeightChange: (weight_kg: number) => mutateSet(index, { weight_kg }),
      onRepsChange: (reps_number: number) => mutateSet(index, { reps_number }), 
      onRestChange: (rest_seconds: number) => mutateSet(index, { rest_seconds }),
    },
  )
}

function addSet() {
  const sets = exercise.data.sets || []
  const lastSet = sets[sets.length - 1]
  
  const newSet = {
    id: Date.now(),
    weight_kg: lastSet ? lastSet.weight_kg : 0,
    reps_number: lastSet ? lastSet.reps_number : 0,
    rest_seconds: lastSet ? lastSet.rest_seconds : 0,
  } as ExSet

  const newIndex = sets.length
  mutateExercise({ sets: [...sets, newSet] })
  openSetModal(newSet, newIndex, 'weight')
}
</script>

<template>
  <div class="flex flex-col bg-pane-bg p-4 mt-4 rounded-2xl">
    <div class="flex flex-1 w-full items-stretch bg-pane-bg cursor-pointer">
      <img 
        :src="exercise.data.image_url ?? 'https://placehold.co/150x150/555555/ffffff?text=N'" 
        :alt="exercise.data.title"
        class="rounded-2xl size-20"
      >

      <div
        ref="contentRef"
        class="flex flex-col px-4 w-full gap-2 justify-center min-w-0"
      >
        <h3 class="text-pane-title text-md font-bold truncate">
          {{ exercise.data.title }}
        </h3>
      
        <Tags :exercise="exercise.data" />
      </div>
      
      <div>
        <button
          class="text-gray-500 px-1"
          @click="onRemove(exercise.data)"
        >
          <XMarkIcon />
        </button>
      </div>
    </div>
    
    <div 
      v-if="exercise.data.sets && exercise.data.sets.length > 0" 
      class="mt-2 w-full overflow-x-auto no-scrollbar"
    >
      <table 
        class="w-full table-auto border-separate" 
        style="border-spacing: 0 0.5rem;"
      >
        <thead>
          <tr class="">
            <th class="p-2 px-3 w-max bg-main-bg/50 rounded-l-xl" />

            <th class="text-left font-bold text-pane-title text-sm p-2 px-4.5 w-max bg-main-bg/50">
              Weight
            </th>

            <th class="text-left font-bold text-pane-title text-sm p-2 px-4.5 w-max bg-main-bg/50">
              Reps
            </th>
            
            <th class="text-left font-bold text-pane-title text-sm p-2 px-4.5 w-max bg-main-bg/50">
              Rest
            </th>

            <th class="px-3 pb-1 w-full text-right bg-main-bg/50 rounded-r-xl" />
          </tr>
        </thead>

        <TransitionGroup
          tag="tbody"
          name="list"
        >
          <tr 
            v-for="(set, index) in exercise.data.sets" 
            :key="set.id" 
            :class="[
              'cursor-pointer',
              (hideDragged && draggedIndex === index) ? 'opacity-0' : 'bg-main-bg/50'
            ]"
            role="button"
            :draggable="draggableRowIndex === index"
            @dragstart="(e) => onDragStart(e, index)"
            @dragenter.prevent="(e) => onDragEnter(e, index)"
            @dragend="onDragEnd"
            @dragover.prevent
            @drop="onDragEnd"
            @click="() => openSetModal(set, index)"
          >
            <td class="rounded-l-xl px-2 py-2.5 text-center whitespace-nowrap">
              <div 
                class="cursor-grab active:cursor-grabbing text-gray-400 flex items-center justify-center p-1"
                @mouseenter="draggableRowIndex = index"
                @mouseleave="draggableRowIndex = null"
                @touchstart="draggableRowIndex = index"
                @touchend="draggableRowIndex = null"
                @click.stop
              >
                <HandleIcon />
              </div>
            </td>

            <td
              class="px-3 py-2.5 text-left whitespace-nowrap"
              @click.stop="openSetModal(set, index, 'weight')"
            >
              <button class="inline-flex items-center px-2 py-1.5 rounded-lg gap-1.5 font-bold stroke-2 text-sm bg-grad-start/15 text-grad-start">
                <FireIcon />
                {{ set.weight_kg }}kg
              </button>
            </td>

            <td
              class="px-3 py-2.5 text-left whitespace-nowrap"
              @click.stop="openSetModal(set, index, 'reps')"
            >
              <button class="inline-flex items-center px-2 py-1.5 rounded-lg gap-1.5 font-bold stroke-2 text-sm bg-grad-start/15 text-grad-start">
                <FireIcon />
                {{ set.reps_number }}
              </button>
            </td>

            <td
              class="px-3 py-2.5 text-left whitespace-nowrap"
              @click.stop="openSetModal(set, index, 'rest')"
            >
              <button class="inline-flex items-center px-2 py-1.5 rounded-lg gap-1.5 font-bold stroke-2 text-sm bg-grad-start/15 text-grad-start">
                <ClockIcon />
                {{ formatRestTime(set.rest_seconds) }}
              </button>
            </td>

            <td class="rounded-r-xl px-3 py-2.5 text-center whitespace-nowrap">
              <button
                class="ml-auto block p-2 items-center group"
                @click.stop="removeSet(set)"
              >
                <div
                  class="
                    flex content-center items-center justify-center rounded-full
                    text-gray-300 group-hover:bg-red-400 group-hover:text-red-800
                    aspect-square cursor-pointer duration-200 transition-colors ease-in-out
                  "
                >
                  <x-mark-icon class="w-4 h-4" />
                </div>
              </button>
            </td>
          </tr>
        </TransitionGroup>
      </table>
    </div>
    
    <button
      class="mt-2 w-full flex items-center justify-center pl-3 pr-4 py-2.5 gap-2 text-sm rounded-xl bg-linear-120 from-grad-start to-grad-end text-grad-text font-bold"
      @click="addSet"
    >
      <PlusIcon class-name="size-5 stroke-2" />
      Add set
    </button>
  </div>
</template>


<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
