<script setup lang="ts">
const { className = 'w-6 h-6' } = defineProps<{ className?: string, }>()
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    :class="className"
  >
    <slot />
  </svg>
</template>
