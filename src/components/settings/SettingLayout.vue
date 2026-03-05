<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <div class="flex justify-between gap-2">
    <div class="flex flex-col gap-1">
      <div class="text-pane-title text-sm font-bold">
        {{ title }}
      </div>

      <div class="text-pane-text text-sm">
        {{ subtitle }}
      </div>
    </div>

    <div class="flex items-center">
      <slot />
    </div>
  </div>
</template>
