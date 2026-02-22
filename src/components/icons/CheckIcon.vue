<script setup lang="ts">
import IconLayout from '$src/components/icons/IconLayout.vue'

const { className = 'size-5 stroke-2' } = defineProps<{ className?: string, }>()
</script>

<template>
  <IconLayout :class-name="className">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="m4.5 12.75 6 6 9-13.5"
    />
  </IconLayout>
</template>
