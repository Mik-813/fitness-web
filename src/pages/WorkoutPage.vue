<script setup lang="ts">
import { computed } from 'vue'
import { endpoints } from '$src/api/endpoints'
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
  <TimerComponent
    :limit="20"
    @record="handleRecord"
  />

  <PageLayout :hide="exercises.data === undefined">
    <template v-if="exercises.data?.length ?? 0 > 0">
      <ExercisePane 
        v-for="exercise in exercises.data"
        :key="exercise.id"
        :exercise="exercise"
      />
    </template>

    <NoData
      v-else
      title="No exercises provided"
      subtitle="Add some exercises to start tracking your progress"
    />
  </PageLayout>
</template>
