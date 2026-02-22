<script setup lang="ts">
// 1. Define Props
// We define 'error' here. We do NOT define 'children' in props
// because Vue handles that automatically via slots.
defineProps<{ error?: string | null | boolean, }>()
</script>

<template>
  <template v-if="error">
    <div class="border-2 border-red-500 rounded-md">
      <slot />
    </div>
    
    <span class="text-sm mt-1">
      {{ error }}
    </span>
  </template>
</template>
