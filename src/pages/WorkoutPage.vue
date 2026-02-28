<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { computed, ref } from 'vue'
import * as endpoints from '$src/api/endpoints'
import DateSelector from '$src/components/DateSelector.vue'
import ExercisePane from '$src/components/workout/ExercisePane.vue'
import TimerComponent from '$src/components/workout/TimerComponent.vue'
import { customToast } from '$src/utils/custom-toast'

function getDateFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  const dateStr = urlParams.get('date')
  return dateStr ? new Date(dateStr) : undefined
}

const today = new Date(Date.now())
const currentDate = ref(getDateFromURL() ?? today)
const datesState = endpoints.getDatesRequest({ filter: 'exercises' }).use({})
const dates = computed(() => {
  const list = Object.keys(datesState.data).map(dateStr => new Date(dateStr))
  const hasToday = list.some(d => d.toDateString() === today.toDateString())
  const hasCurrentDate = list.some(d => d.toDateString() === currentDate.value.toDateString())
  if (!hasToday) list.push(today)
  if (currentDate.value.toDateString() != today.toDateString() && !hasCurrentDate)
    list.push(currentDate.value)
  return list
})

const handleRecord = (time: number) => {
  customToast.error(time.toString())
}
const exercises = computed(() => endpoints.getExercisesRequest(currentDate.value).use<Exercise[]>([]))
</script>

<template>
  <TimerComponent
    :limit="20"
    @record="handleRecord"
  />
  
  <div class="bg-linear-to-r from-grad-start to-grad-end">
    <DateSelector
      v-model="currentDate"
      :available-dates="dates"
    />
  </div>

  <div class="flex flex-col w-full h-screen overflow-hidden relative">
    <ScrollableTemplate>
      <main
        v-auto-animate
        class="px-4 py-4 max-w-4xl mx-auto"
      >
        <template v-if="exercises.data?.length ?? 0 > 0">
          <ExercisePane 
            v-for="exercise in exercises.data"
            :key="exercise.id"
            :exercise="exercise"
          />
        </template>
        
        <div
          v-else-if="exercises.data === undefined"
          class="p-4"
        />

        <NoData
          v-else
          title="No exercises provided"
          subtitle="Add some exercises to start tracking your progress"
        />
      </main>

      <div class="h-30" />
    </ScrollableTemplate>
  </div>
</template>
