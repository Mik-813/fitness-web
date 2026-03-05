<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import XMarkIcon from '$src/components/icons/XMarkIcon.vue'

const visible = defineModel<boolean>('visible', { default: undefined })

onMounted(() => {
  visible.value ??= true
})

const props = defineProps<{
  title?: string
  disableNativeClosing?: boolean
}>()

const modalContainer = ref<HTMLElement | null>(null)

function closeModal() {
  visible.value = false
}

if (!props.disableNativeClosing){
  onClickOutside(modalContainer, closeModal)
}
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
      class="flex flex-col justify-around items-center p-2 bg-black/50 z-50 fixed inset-0"
    >
      <div class="sm:hidden" />
      
      <form
        ref="modalContainer"
        class="flex flex-col bg-white rounded-lg shadow-lg w-full h-fit max-w-md p-4 gap-1"
        @submit.prevent
      >
        <div class="flex items-center justify-between">
          <div>
            <span class="text-black font-bold text-[1.07rem] pr-1">
              {{ title }}
            </span>

            <div class="mt-1 rounded h-0.75 bg-primary" />
          </div>
          
          <div
            v-if="!disableNativeClosing"
            aria-label="close button"
            role="button"
            tabindex="0"
            class="text-gray-500 cursor-pointer"
            @click="closeModal"
          >
            <XMarkIcon class-name="size-5" />
          </div>
        </div>
        
        <div class="pt-1">
          <slot :close="closeModal" />
        </div>
      </form>
    </div>
  </Transition>
</template>
