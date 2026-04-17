<script setup lang="ts">
import IconLayout from '$src/components/icons/IconLayout.vue'

const { className = 'w-6 h-6' } = defineProps<{ className?: string, }>()
</script>

<template>
  <IconLayout :class-name="className">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </IconLayout>
</template>
