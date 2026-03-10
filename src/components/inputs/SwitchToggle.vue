<script setup lang="ts">
const props = defineProps<{
  onToggle?: (active: boolean) => void
  active: boolean 
}>()

const toggle = () => {
  props.onToggle?.(!props.active)
}
</script>

<template>
  <div class="h-6">
    <button
      type="button"
      role="switch"
      :aria-checked="active"
      class="relative block h-full aspect-[1.75/1] cursor-pointer rounded-full transition-colors duration-250 focus:outline-none focus-visible:ring-2"
      :class="active ? 'bg-primary' : 'bg-pane-text/20'"
      @click="toggle"
    >
      <span
        aria-hidden="true"
        class="bg-grad-text pointer-events-none absolute top-0.5 bottom-0.5 aspect-square rounded-full shadow-md ring-0 transition-all duration-200"
        :class="active ? 'left-[calc(100%-0.125rem)] -translate-x-full' : 'left-0.5 translate-x-0'"
      />
    </button>
  </div>
</template>
