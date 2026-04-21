<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ModalWindow from '$src/components/reusable/ModalWindow.vue'
import TimePicker from '$src/components/workout/TimePicker.vue'

const props = defineProps<{
  seconds: number
  onRestChange: (rest_seconds: number) => void
}>()

const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  setTimeout(
    () => {
      let targetInput: HTMLInputElement | undefined = containerRef.value?.querySelector('input') ?? undefined

      if (targetInput) {
        targetInput.focus()
        if (typeof targetInput.select === 'function') targetInput.select()
      }
    },
    150,
  )
})
</script>

<template>
  <ModalWindow title="Rest time">
    <div
      ref="containerRef"
      class="flex flex-col gap-1 px-1.5 py-2"
    >
      <TimePicker
        :value="seconds"
        @change="props.onRestChange"
      />
    </div>
  </ModalWindow>
</template>
