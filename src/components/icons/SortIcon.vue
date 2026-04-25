<script setup lang="ts">
import IconLayout from '$src/components/icons/IconLayout.vue'

const { className = 'w-6 h-6 stroke-2' } = defineProps<{ className?: string, }>()
</script>

<template>
  <IconLayout :class-name="className">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
    />
  </IconLayout>
</template>
