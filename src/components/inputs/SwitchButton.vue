<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  text: string
  icon: Component
  active: boolean
}

defineProps<Props>()

const emit = defineEmits<(e: 'click') => void>()
</script>

<template>
  <button
    type="button"
    :disabled="active"
    class="flex items-center gap-1 py-1 font-bold disabled:cursor-default px-2 rounded-md"
    :class="{
      'bg-grad-text text-primary': active,
      'bg-transparent': !active
    }"
    @click="emit('click')"
  >
    <component :is="icon" />

    <span class="hidden sm:block">
      {{ text }}
    </span>
  </button>
</template>
