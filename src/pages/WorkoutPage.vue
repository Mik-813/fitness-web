<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { computed } from 'vue'
import { endpoints } from '$src/api/endpoints'
import NoData from '$src/components/NoData.vue'
import PageLayout from '$src/components/templates/PageLayout.vue'
import ExercisePane from '$src/components/workout/ExercisePane.vue'
import TimerComponent from '$src/components/workout/TimerComponent.vue'
import { currentDate } from '$src/states/date'
import { settings } from '$src/states/state'
import { customToast } from '$src/utils/custom-toast'
import { popElementById } from '$src/utils/pop-indentifiable'


const handleRecord = (time: number) => {
  customToast.error(time.toString())
}
const exercises = computed(() => endpoints.getExercises(currentDate.value).use(undefined))

async function tryRemoveExercise(exercise: Exercise){
  if (!exercises.value.data) return
  exercises.value.mutate({
    data: popElementById(exercise, exercises.value.data),
    request: endpoints.removeExercise(exercise.id).invoke,
    onError: () => {
      customToast.error('Couldn\'t delete exercise')
    },
  })
}
</script>

<template>
  <div class="flex flex-col h-screen w-full relative overflow-hidden">
    <div class="z-10 shrink-0">
      <TimerComponent :limit="settings.data?.rest_limit ?? 0" />
    </div>
    
    <PageLayout :hide="exercises.data === undefined">
      <div
        v-if="exercises.data?.length ?? 0 > 0"
        v-auto-animate
      >
        <ExercisePane
          v-for="(exercise, idx) in exercises.data"
          :key="exercise.id"
          v-model="exercises.data![idx]"
          @remove="tryRemoveExercise"
        />
      </div>

      <NoData
        v-else-if="exercises.data !== undefined"
        title="No exercises provided"
        subtitle="Add some exercises to start tracking your progress"
      />

      <div v-else />
    </PageLayout>
  </div>
</template>
