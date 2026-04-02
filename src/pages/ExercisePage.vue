<script setup lang="ts">
import WorkoutLayout from '$src/components/templates/WorkoutLayout.vue'

const props = defineProps<{ exercise: Exercise, }>()


function handleRecord(time: number) {
  console.log('Timer recorded:', time)
}
</script>

<template>
  <WorkoutLayout @record="handleRecord">
    <pre>
      {{ exercise }}
    </pre>
  </WorkoutLayout>
</template>
