<script setup lang="ts">
import IconLayout from '$src/components/icons/IconLayout.vue'

const { className = 'w-6 h-6' } = defineProps<{ className?: string, }>()
</script>

<template>
  <IconLayout :class-name="className">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </IconLayout>
</template>
