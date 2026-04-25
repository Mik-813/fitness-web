<script setup lang="ts">
import IconLayout from '$src/components/icons/IconLayout.vue'

const { className = 'w-6 h-6' } = defineProps<{ className?: string, }>()
</script>

<template>
  <IconLayout :class-name="className">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
    />
  </IconLayout>
</template>
