<script setup lang="ts" generic="T">
import { ref, onMounted, nextTick, watch } from 'vue'

const props = defineProps<{
  items: Item<T>[]
  modelValue?: number
}>()

const emit = defineEmits<(e: 'update:modelValue', value: number) => void>()

const activeIndex = ref(props.modelValue ?? 0)
const tabRefs = ref<HTMLElement[]>([])
const indicatorLeft = ref(0)
const indicatorWidth = ref(0)

const updateIndicator = async (index: number) => {
  await nextTick()
  const activeElement = tabRefs.value[index]
  if (activeElement) {
    indicatorLeft.value = activeElement.offsetLeft
    indicatorWidth.value = activeElement.offsetWidth
  }
}

const handleTabClick = (item: Item<T>, index: number) => {
  activeIndex.value = index
  emit('update:modelValue', index)
  
  if (item.onClick) {
    item.onClick(item)
  }
  
  updateIndicator(index)
}

watch(() => props.modelValue, (newVal) => {
  if (newVal !== undefined && newVal !== activeIndex.value) {
    activeIndex.value = newVal
    updateIndicator(newVal)
  }
})

watch(
  () => props.items, 
  () => {
    if (activeIndex.value >= props.items.length) {
      activeIndex.value = Math.max(0, props.items.length - 1)
      emit('update:modelValue', activeIndex.value)
    }
    updateIndicator(activeIndex.value)
  }, 
  { deep: true },
)

onMounted(() => {
  updateIndicator(activeIndex.value)
})
</script>

<template>
  <div class="relative inline-flex p-1.5 rounded-lg bg-main-bg">
    <div
      class="absolute top-1.5 bottom-1.5 rounded-lg bg-linear-to-r from-grad-start to-grad-end transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
      :style="{ left: `${indicatorLeft}px`, width: `${indicatorWidth}px` }"
    />

    <button
      v-for="(item, index) in items"
      :key="index"
      ref="tabRefs"
      class="relative z-10 flex flex-col items-center justify-center px-6 py-2 bg-transparent border-none rounded-lg cursor-pointer transition-colors duration-300 group"
      :class="[
        activeIndex === index
          ? 'text-grad-text'
          : 'text-main-text-secondary hover:text-main-text'
      ]"
      @click="handleTabClick(item, index)"
    >
      <span class="font-medium">
        {{ item.title }}
      </span>
    </button>
  </div>
</template>
