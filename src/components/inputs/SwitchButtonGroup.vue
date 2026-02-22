<script setup lang="ts">
import { ref, onMounted, onUnmounted, useTemplateRef, nextTick } from 'vue'
import type { Component } from 'vue'

interface ButtonItem {
  text: string
  icon: Component
  onClick: () => void
}

const props = defineProps<{
  defaultIndex?: number
  items: ButtonItem[]
}>()

const activeIndex = ref(props.defaultIndex ?? 0)
const buttons = useTemplateRef<HTMLButtonElement[]>('buttons')
const pillStyle = ref({
  left: '0px',
  width: '0px', 
})

const movePill = (index: number) => {
  const btn = buttons.value?.[index]
  if (!btn) return
  pillStyle.value = {
    left: `${btn.offsetLeft}px`,
    width: `${btn.offsetWidth}px`,
  }
}

const handleSelection = (index: number) => {
  activeIndex.value = index
  movePill(index)
  props.items[index].onClick()
}

const handleResize = () => movePill(activeIndex.value)

onMounted(() => {
  nextTick(() => movePill(activeIndex.value))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="relative flex items-center gap-1 p-1 w-fit rounded-lg">
    <div
      class="absolute top-1 bottom-1 rounded-md bg-grad-text/15 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.35,0,0.25,1)]"
      :style="pillStyle"
    />

    <button
      v-for="(item, index) in items"
      :key="index"
      ref="buttons"
      type="button"
      :aria-pressed="activeIndex === index"
      class="relative flex items-center gap-1 py-1 font-bold disabled:cursor-default px-2 rounded-md transition-colors duration-200"
      :class="activeIndex === index
        ? 'text-grad-text'
        : 'text-grad-text-dimmed'"
      @click="handleSelection(index)"
    >
      <component
        :is="item.icon"
        class="size-4 shrink-0"
      />

      <span class="hidden sm:block">
        {{ item.text }}
      </span>
    </button>
  </div>
</template>
