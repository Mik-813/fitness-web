<script setup lang="ts">
import IconLayout from '$src/components/icons/IconLayout.vue'

const { className = 'w-6 h-6' } = defineProps<{ className?: string, }>()
</script>

<template>
  <IconLayout :class-name="className">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </IconLayout>
</template>
