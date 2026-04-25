<script setup lang="ts" generic="T">
import { computed, ref } from 'vue'
import ChevronDownIcon from '$src/components/icons/ChevronDownIcon.vue' 
import DropdownComponent from '$src/components/reusable/DropdownComponent.vue'

const props = defineProps<{
  items: Item<T>[]
  state: number
}>()

const emit = defineEmits<(e: 'select', item: Item<T>) => void>()

const isOpen = ref(false)
const buttonRef = ref<HTMLElement | null>(null)
const selectedItem = computed<Item<T>>(() => props.items[props.state ?? 0])

const toggle = () => {
  isOpen.value = !isOpen.value
}

const handleSelect = (item: Item<T>) => {
  if (item.onClick) {
    item.onClick(item)
  }
  
  emit('select', item)
  isOpen.value = false
}
</script>

<template>
  <div
    ref="buttonRef"
    class="relative flex flex-col items-center"
  >
    <button
      type="button"
      class="
        flex items-center justify-between gap-2
        w-max rounded-md px-3.5 pr-2.5 py-2 text-sm font-medium
        ring-1 ring-inset ring-primary/20 focus:outline-none transition-colors duration-200 bg-pane-bg text-pane-text hover:bg-primary/2.5
        "
      @click="toggle"
    >
      <span>{{ selectedItem?.title }}</span>

      <ChevronDownIcon
        class-name="size-5 transition-transform duration-200"
        :class="isOpen ? 'rotate-180' : 'rotate-0'"
      />
    </button>

    <Transition name="fade">
      <DropdownComponent
        v-if="isOpen"
        :items="[{ category: '', items: items }]"
        :trigger-ref="buttonRef"
        @select="handleSelect"
        @close="isOpen = false"
      />
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
