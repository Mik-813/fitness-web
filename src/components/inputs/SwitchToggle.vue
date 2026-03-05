<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  initialState?: boolean
  onToggled?: (isActive: boolean) => void
}>()

const isActive = ref(props.initialState)

const toggle = () => {
  isActive.value = !isActive.value
  props.onToggled?.(isActive.value)
}
</script>

<template>
  <div class="h-6">
    <button
      type="button"
      role="switch"
      :aria-checked="isActive"
      class="relative block h-full aspect-[1.75/1] cursor-pointer rounded-full transition-colors duration-250 focus:outline-none focus-visible:ring-2"
      :class="isActive ? 'bg-primary' : 'bg-pane-text/20'"
      @click="toggle"
    >
      <span
        aria-hidden="true"
        class="bg-grad-text pointer-events-none absolute top-0.5 bottom-0.5 aspect-square rounded-full shadow-md ring-0 transition-all duration-200"
        :class="isActive ? 'left-[calc(100%-0.125rem)] -translate-x-full' : 'left-0.5 translate-x-0'"
      />
    </button>
  </div>
</template>
