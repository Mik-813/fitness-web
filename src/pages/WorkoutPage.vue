<script setup lang="ts">
import { computed } from 'vue'
import { endpoints } from '$src/api/endpoints'
import NoData from '$src/components/NoData.vue'
import PageLayout from '$src/components/templates/PageLayout.vue'
import ExercisePane from '$src/components/workout/ExercisePane.vue'
import TimerComponent from '$src/components/workout/TimerComponent.vue'
import { currentDate } from '$src/states/date'
import { customToast } from '$src/utils/custom-toast'

const handleRecord = (time: number) => {
  customToast.error(time.toString())
}
const exercises = computed(() => endpoints.getExercises(currentDate.value).use(undefined))
</script>

<template>
  <div class="flex flex-col h-screen w-full relative overflow-hidden">
    <div class="z-10 shrink-0">
      <TimerComponent
        :limit="20"
        @record="handleRecord"
      />
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
