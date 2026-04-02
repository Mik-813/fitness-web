<script setup lang="ts">
const props = defineProps<{ exercise: Exercise, }>()
</script>

<template>
  <pre>
    {{ exercise }}
  </pre>
</template>
