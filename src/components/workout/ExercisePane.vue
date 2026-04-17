<script setup lang="ts">
import { watch } from 'vue'
import { endpoints } from '$src/api/endpoints'
import ClockIcon from '$src/components/icons/ClockIcon.vue'
import FireIcon from '$src/components/icons/FireIcon.vue'
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
        // if (res.error.errors) {
        //   errors.value = res.error.errors
        // }
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
  mutateExercise({
    sets: [
      ...exercise.data.sets.filter((_, index) => index !== setIdx), {
        ...exercise.data.sets[setIdx],
        ...prop, 
      },
    ], 
  })
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
            <th class="text-left font-bold text-pane-title text-sm p-2 px-4.5 w-max bg-main-bg/50 rounded-l-xl">
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

        <tbody>
          <tr 
            v-for="(set, index) in exercise.data.sets" 
            :key="index" 
            class="bg-main-bg/50 cursor-pointer"
            role="button"
            @click="() => showModal(SetModal, {
              set,
              onWeightChange: (weight_kg: number) => mutateSet(index, { weight_kg }),
              onRepsChange: (reps_number: number) => mutateSet(index, { reps_number }), 
              onRestChange: (rest_seconds: number) => mutateSet(index, { rest_seconds })
            })"
          >
            <td class="rounded-l-xl px-3 py-2.5 text-left whitespace-nowrap">
              <button class="inline-flex items-center p-2 rounded-lg gap-1.5 font-bold stroke-2 text-sm bg-grad-start/15 text-grad-start">
                <FireIcon />
                {{ set.weight_kg }}kg
              </button>
            </td>

            <td class="px-3 py-2.5 text-left whitespace-nowrap">
              <button class="inline-flex items-center p-2 rounded-lg gap-1.5 font-bold stroke-2 text-sm bg-grad-start/15 text-grad-start">
                <FireIcon />
                {{ set.weight_kg }}kg
              </button>
            </td>

            <td class="px-3 py-2.5 text-left whitespace-nowrap">
              <button class="inline-flex items-center p-2 rounded-lg gap-1.5 font-bold stroke-2 text-sm bg-grad-start/15 text-grad-start">
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
        </tbody>
      </table>
    </div>
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
</style>
