<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CustomInput from '$src/components/inputs/CustomInput.vue'
import ModalWindow from '$src/components/reusable/ModalWindow.vue'
import TimePicker from '$src/components/workout/TimePicker.vue'

const props = defineProps<{
  set: ExSet
  onWeightChange: (weight_kg: number) => void
  onRepsChange: (reps: number) => void
  onRestChange: (rest_seconds: number) => void
  initialFocus?: 'weight' | 'reps' | 'rest'
}>()

const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  setTimeout(
    () => {
      if (!containerRef.value || !props.initialFocus) return

      const inputs = containerRef.value.querySelectorAll('input')
      let targetInput: HTMLInputElement | null = null

      if (props.initialFocus === 'weight') targetInput = inputs[0]
      else if (props.initialFocus === 'reps') targetInput = inputs[1]
      else if (props.initialFocus === 'rest') targetInput = inputs[2]

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
  <ModalWindow title="Set">
    <div
      ref="containerRef"
      class="flex flex-col gap-1 px-1.5 py-2"
    >
      <CustomInput
        :value="props.set.weight_kg"
        label="Weight (kg)"
        type="calculate"
        @change="(value)=>props.onWeightChange(Number(value))"
      />

      <CustomInput
        :value="props.set.reps_number"
        label="Repetitions" 
        type="calculate"
        @change="(value)=>props.onRepsChange(Number(value))"
      />

      <TimePicker
        :value="props.set.rest_seconds"
        @change="props.onRestChange"
      />
    </div>
  </ModalWindow>
</template>
