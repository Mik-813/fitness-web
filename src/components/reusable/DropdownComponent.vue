<script setup lang="ts" generic="T">
import { onClickOutside } from '@vueuse/core'
import { ref, onMounted, nextTick, computed } from 'vue'

const props = defineProps<{
  items: Item<T>[]
  triggerRef?: HTMLElement | null
}>()

const emit = defineEmits<{
  (e: 'select', item: Item<T>): void
  (e: 'close'): void
}>()

const dropdownRef = ref<HTMLElement | null>(null)

const verticalClass = ref('top-[calc(100%+0.5rem)]') 
const horizontalClass = ref('left-1/2 -translate-x-1/2') 

const ignoreRef = computed(() => props.triggerRef ?? undefined)

onClickOutside(
  dropdownRef,
  () => emit('close'),
  { ignore: [ignoreRef] }, 
)

onMounted(async () => {
  await nextTick() 
  if (!props.triggerRef || !dropdownRef.value) return

  const buttonRect = props.triggerRef.getBoundingClientRect()
  const dropdownRect = dropdownRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  const spaceBelow = viewportHeight - buttonRect.bottom
  const spaceAbove = buttonRect.top

  if (spaceBelow < dropdownRect.height && spaceAbove > dropdownRect.height) {
    verticalClass.value = 'bottom-[calc(100%+0.5rem)]'
  }
  
  const buttonCenter = buttonRect.left + (buttonRect.width / 2)
  const halfDropdown = dropdownRect.width / 2

  if (buttonCenter - halfDropdown < 0) {
    
    horizontalClass.value = 'left-0'
  }
  else if (buttonCenter + halfDropdown > viewportWidth) {
    
    horizontalClass.value = 'right-0'
  }
  else {
    
    horizontalClass.value = 'left-1/2 -translate-x-1/2'
  }
})
</script>

<template>
  <div
    ref="dropdownRef"
    class="absolute z-50 flex flex-col w-max overflow-hidden rounded-md shadow-lg ring-1 ring-black/5 bg-pane-bg text-pane-text p-1"
    :class="[verticalClass, horizontalClass]"
  >
    <button
      v-for="(item, index) in items"
      :key="index"
      class="px-4 py-2 rounded text-left text-sm text-pane-title transition-colors duration-200 ease-in-out hover:bg-primary/5"
      @click="emit('select', item)"
    >
      {{ item.title }}
    </button>
  </div>
</template>
