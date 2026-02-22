<script setup lang="ts">
import { onClickOutside } from '@vueuse/core' // *See note below
import { ref } from 'vue'
import XMarkIcon from '../icons/XMarkIcon.vue'

// 1. $bindable(false) -> defineModel
// Vue 3.4+ macro for two-way binding (v-model:visible)
const visible = defineModel<boolean>('visible', { default: false })

// 2. Props
defineProps<{ title?: string, }>()

// 3. Logic & Refs
const modalContainer = ref<HTMLElement | null>(null)

function closeModal() {
  visible.value = false
}

// 4. Action -> Composable
// Instead of use:onClickOutside, we use a ref and a composable
onClickOutside(modalContainer, closeModal)
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-150 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="flex flex-col justify-around items-center p-2 bg-black/50 z-50 fixed inset-0 z-50"
    >
      <div class="sm:hidden" />
      
      <form
        ref="modalContainer"
        class="flex flex-col bg-white rounded-lg shadow-lg w-full h-fit max-w-md px-4 py-3 gap-1"
        @submit.prevent
      >
        <div class="flex items-center justify-between">
          <span class="text-gray-600 font-medium">
            {{ title }}
          </span>
          
          <div
            aria-label="close button"
            role="button"
            tabindex="0"
            class="text-gray-500 px-1 cursor-pointer"
            @click="closeModal"
          >
            <XMarkIcon />
          </div>
        </div>
        
        <main>
          <slot :close="closeModal" />
        </main>
      </form>
    </div>
  </Transition>
</template>
