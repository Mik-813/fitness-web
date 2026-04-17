<script setup lang="ts">
import CustomInput from '$src/components/inputs/CustomInput.vue'
import ModalWindow from '$src/components/reusable/ModalWindow.vue'
import TimePicker from '$src/components/workout/TimePicker.vue'

const props = defineProps<{
  set: ExSet
  onWeightChange: (weight_kg: number) => void
  onRepsChange: (reps: number) => void
  onRestChange: (rest_seconds: number) => void
}>()
</script>

<template>
  <ModalWindow title="Set">
    <div class="flex flex-col gap-1 px-1.5 py-2">
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
