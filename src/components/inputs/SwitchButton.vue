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
    class="flex items-center gap-1 py-1 font-bold transition-all duration-200 disabled:cursor-default"
    :class="{
      'px-2 bg-grad-text/20 rounded-md': active,
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
