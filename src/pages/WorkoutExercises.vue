<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate'
import { computed } from 'vue'
import { endpoints } from '$src/api/endpoints'
import NoData from '$src/components/NoData.vue'
import PageLayout from '$src/components/templates/PageLayout.vue'
import ExercisePane from '$src/components/workout/ExercisePane.vue'
import { currentDate } from '$src/states/date'

const exercises = computed(() => endpoints.getExercises(currentDate.value).use(undefined))
</script>

<template>
  <PageLayout :hide="exercises.data === undefined">
    <div
      v-if="exercises.data?.length ?? 0 > 0"
      v-auto-animate
    >
      <ExercisePane
        v-for="exercise in exercises.data"
        :key="exercise.id"
        :exercise="exercise"
      />
    </div>

    <NoData
      v-else-if="exercises.data !== undefined"
      title="No exercises provided"
      subtitle="Add some exercises to start tracking your progress"
    />

    <div v-else />
  </PageLayout>
</template>
