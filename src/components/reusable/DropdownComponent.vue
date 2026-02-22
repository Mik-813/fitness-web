<script setup lang="ts" generic="T">
import { defineModel } from 'vue'
import XMarkIcon from '$src/components/icons/XMarkIcon.vue'

// 1. Types
// Assuming ListItem structure based on your usage. 
// If this is imported externally, remove this interface and import it.
export interface ListItem<T> {
  title: string
  subtitle?: string
  onClick?: (item: ListItem<T>) => void
  onRemove?: (item: ListItem<T>) => void
  // ... T properties
}

// 2. Two-way binding (replaces $bindable)
// Requires Vue 3.4+. If older, use props/emits manually.
const visible = defineModel<boolean>('visible', { default: false })

// 3. Props
// Note: We do NOT define 'empty' here. In Vue, that is a <slot>.
const props = defineProps<{
  items: ListItem<T>[]
  onClick?: (item: ListItem<T>) => void
  onRemove?: (item: ListItem<T>) => void
}>()

// 4. Helper for the empty slot action
const close = () => {
  visible.value = false
}

// 5. Handlers to keep template clean
function handleItemClick(item: ListItem<T>) {
  visible.value = false
  item.onClick?.(item)
  props.onClick?.(item)
}

function handleRemove(item: ListItem<T>) {
  item.onRemove?.(item)
  props.onRemove?.(item)
}
</script>

<template>
  <ul 
    v-if="visible" 
    class="absolute inset-x-0 bg-white shadow rounded-lg py-2 mt-2 z-50"
  >
    <template v-if="items.length > 0">
      <div 
        v-for="(item, index) in items" 
        :key="(item as any).id || index"
        class="flex justify-between hover:bg-purple-50/50 text-sm"
      >
        <button
          class="flex-1 px-4 cursor-pointer flex items-center justify-start"
          @click="handleItemClick(item)"
        >
          <div class="flex gap-2">
            {{ item.title }}
            <span
              v-if="item.subtitle"
              class="text-gray-400"
            >
              {{ item.subtitle }}
            </span>
          </div>
        </button>

        <button
          class="p-2 items-center group"
          @click="handleRemove(item)"
        >
          <div class="content-center h-6 rounded-full text-gray-300 group-hover:text-gray-500 group-hover:bg-gray-500/10 aspect-square transition-colors cursor-pointer">
            <x-mark-icon />
          </div>
        </button>
      </div>
    </template>

    <div v-else>
      <slot
        name="empty"
        :close="close"
      />
    </div>
  </ul>
</template>
