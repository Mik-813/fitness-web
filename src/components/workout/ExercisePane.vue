<script setup lang="ts">
import { watch, ref, nextTick, computed } from 'vue'
import { endpoints } from '$src/api/endpoints'
import ChevronDownIcon from '$src/components/icons/ChevronDownIcon.vue'
import ClockIcon from '$src/components/icons/ClockIcon.vue'
import FireIcon from '$src/components/icons/FireIcon.vue'
import HandleIcon from '$src/components/icons/HandleIcon.vue'
import PlusIcon from '$src/components/icons/PlusIcon.vue'
import ScalesIcon from '$src/components/icons/ScalesIcon.vue'
import XMarkIcon from '$src/components/icons/XMarkIcon.vue'
import Tags from '$src/components/workout/ExerciseTags.vue'
import SetModal from '$src/components/workout/SetModal.vue'
import TimeModal from '$src/components/workout/TimeModal.vue'
import { settings } from '$src/states/state'
import { startTimer, stopTimer, timerSeconds } from '$src/states/timer'
import { customToast } from '$src/utils/custom-toast'
import { showModal } from '$src/utils/show-modal'

const formatRestTime = (seconds: number) => {
  if (!seconds) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

defineProps<{ onRemove: (exercise: Exercise) => void, }>()

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

function openSetModal(set: ExSet, index: number, initialFocus?: 'weight' | 'reps') {
  showModal(
    SetModal, 
    {
      set,
      initialFocus,
      onWeightChange: (weight_kg: number) => mutateSet(index, { weight_kg }),
      onRepsChange: (reps_number: number) => mutateSet(index, { reps_number }),
    },
  )
}

function openTimeModal(set: ExSet, index: number) {
  let seconds = set.rest_seconds ?? 0
  if (seconds === 0 && settings.data?.auto_timer) {
    seconds = timerSeconds.value
  }
  showModal(
    TimeModal, 
    {
      seconds,
      onRestChange: (rest_seconds: number) => mutateSet(index, { rest_seconds }),
    },
  )
  settings.data?.auto_timer && stopTimer()
}


function addSet() {
  const sets = exercise.data.sets || []
  const lastSet = sets[sets.length - 1]
  
  const newSet = {
    id: Date.now(),
    weight_kg: lastSet?.weight_kg ?? 0,
    reps_number: lastSet?.reps_number ?? 0,
    rest_seconds: 0,
  } as ExSet

  const newIndex = sets.length
  mutateExercise({ sets: [...sets, newSet] })
  openSetModal(newSet, newIndex, 'weight')

  settings.data?.auto_timer && startTimer()
}

const isWrapped = ref(true)
const isTransitioning = ref(false)

async function toggleWrapping() {
  if (!document.startViewTransition) {
    isWrapped.value = !isWrapped.value
    return
  }

  isTransitioning.value = true
  await nextTick()

  const transition = document.startViewTransition(() => {
    isWrapped.value = !isWrapped.value
  })

  transition.finished.finally(() => {
    isTransitioning.value = false
  })
}

const tags = computed(() => {
  const { targetMuscles, secondaryMuscles, bodyParts, equipments } = exercise.data.exercise
  return bodyParts.concat(targetMuscles).concat(secondaryMuscles).concat(equipments)
})
</script>

<template>
  <div
    class="flex flex-col bg-pane-bg p-4 mt-4 rounded-2xl transition-all"
    :data-exercise-title="exercise.data.exercise.name"
  >
    <div class="flex items-center justify-between gap-2">
      <button
        class="text-gray-500"
        :style="isTransitioning ? { viewTransitionName: `exercise-toggle-${exercise.data.id}` } : {}"
        @click="toggleWrapping"
      >
        <div :style="{ rotate: isWrapped ? '-90deg' : '0deg', transition: 'rotate 0.2s' }">
          <ChevronDownIcon class="size-5" />
        </div>
      </button>
      
      <img 
        v-if="isWrapped"
        :src="exercise.data.exercise.gifUrl ?? 'https://placehold.co/150x150/555555/ffffff?text=N'" 
        :alt="exercise.data.exercise.name"
        class="rounded-2xl size-20"
        :style="isTransitioning ? { viewTransitionName: `exercise-img-${exercise.data.id}` } : {}"
      >

      <div class="flex flex-col gap-2 px-2">
        <span
          class="first-letter:uppercase font-semibold w-fit"
          :class="exercise.data.exercise.name ? 'text-gray-800' : 'text-gray-400'"
          :style="isTransitioning ? { viewTransitionName: `exercise-title-${exercise.data.id}` } : {}"
        >
          {{ exercise.data.exercise.name || "(Empty title)" }}
        </span>

        <Tags
          v-if="isWrapped"
          :tags="tags"
        />
      </div>
      
      <button
        class="text-gray-500 px-1 self-start"
        :class="isWrapped ? 'ml-auto' : ''"
        @click="onRemove(exercise.data)"
      >
        <XMarkIcon class="h-full" />
      </button>
    </div>
    
    <div
      v-if="!isWrapped"
      class="flex flex-col sm:flex-row gap-6 my-6"
    >
      <img 
        :src="exercise.data.exercise.gifUrl ?? 'https://placehold.co/150x150/555555/ffffff?text=N'" 
        :alt="exercise.data.exercise.name"
        class="w-full max-w-60 aspect-square self-center sm:self-start shrink-0 ml-4 mr-2"
        :style="isTransitioning ? { viewTransitionName: `exercise-img-${exercise.data.id}` } : {}"
      >

      <div class="flex flex-col gap-3 flex-1 p-2">
        <span class="text-sm font-semibold text-gray-800">
          Instructions
        </span>

        <div
          v-if="exercise.data.exercise.instructions"
          class="flex flex-col gap-2 text-sm text-pane-text"
        >
          <div
            v-for="(instruction, idx) in exercise.data.exercise.instructions"
            :key="idx"
            class="flex gap-2 items-baseline"
          >
            <span class="bg-grad-start/20 text-grad-start font-semibold px-2 py-0.5 rounded-md text-sm tabular-nums tracking-tight">
              {{ instruction.replace("Step:", "").split(' ')[0] }}
            </span>

            <span>
              {{ instruction.replace(/^Step:\d+\s+/, "") }}
            </span>
          </div>
        </div>

        <div class="flex-1 h-full" />

        <span class="text-sm font-semibold text-gray-800">
          Tags
        </span>

        <Tags :tags="tags" />
      </div>
    </div>

    <div
      v-if="exercise.data.sets && exercise.data.sets.length > 0" 
      class="mt-2 w-full overflow-x-auto no-scrollbar"
    >
      <span
        v-if="!isWrapped"
        class="text-sm font-semibold text-gray-800"
      >
        Sets
      </span>

      <table 
        class="w-full table-auto border-separate" 
        style="border-spacing: 0 0.5rem;"
      >
        <thead>
          <tr>
            <th class="p-2 px-3 w-max bg-main-bg/50 rounded-l-xl" />

            <th class="text-left font-semibold text-pane-title text-sm p-2 px-4.5 w-max bg-main-bg/50">
              Weight
            </th>

            <th class="text-left font-semibold text-pane-title text-sm p-2 px-4.5 w-max bg-main-bg/50">
              Reps
            </th>

            <th class="text-left font-semibold text-pane-title text-sm p-2 px-4.5 w-full bg-main-bg/50" />
            
            <th class="text-left font-semibold text-pane-title text-sm p-2 px-4.5 w-max bg-main-bg/50">
              Rest
            </th>

            <th class="px-3 pb-1 w-max text-right bg-main-bg/50 rounded-r-xl" />
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
              <button class="tabular-nums tracking-tight flex items-center px-2 py-1.5 rounded-lg gap-1.5 font-semibold stroke-2 text-sm bg-grad-start/15 text-grad-start">
                <ScalesIcon />
                {{ set.weight_kg }}kg
              </button>
            </td>

            <td
              class="px-3 py-2.5 text-left whitespace-nowrap"
              @click.stop="openSetModal(set, index, 'reps')"
            >
              <button class="tabular-nums tracking-tight flex items-center px-2 py-1.5 rounded-lg gap-1.5 font-semibold stroke-2 text-sm bg-grad-start/15 text-grad-start">
                <FireIcon />
                {{ set.reps_number }}
              </button>
            </td>

            <td />

            <td
              class="px-3 py-2.5 text-left whitespace-nowrap"
              @click.stop="openTimeModal(set, index)"
            >
              <button class="tabular-nums tracking-tight flex w-full items-center justify-between pl-2 pr-3 py-1.5 rounded-lg gap-1.5 font-semibold stroke-2 text-sm bg-grad-start/15 text-grad-start">
                <ClockIcon />

                <span v-if="set.rest_seconds">
                  {{ formatRestTime(set.rest_seconds) }}
                </span>

                <span v-else>
                  --:--
                </span>
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
