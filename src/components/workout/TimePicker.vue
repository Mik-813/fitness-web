<script setup lang="ts">
import { ref } from 'vue'
import CustomInput from '$src/components/inputs/CustomInput.vue'

const props = defineProps<{
  value: number
  onChange: (seconds: number) => void
}>()

const seconds = ref(props.value % 60)
const minutes = ref(props.value / 60 >> 0)

const timeChanged = () => {
  let mins = 0
  let secs = 0

  try {
    mins = Number(minutes.value)
    secs = Number(seconds.value)
  }
  catch {
    return 
  }

  if (mins < 0) mins = 0
  if (secs < 0) secs = 0
  if (secs > 59) secs = 59

  props.onChange(mins * 60 + secs)
}
</script>

<template>
  <div class="flex items-center gap-2">
    <CustomInput
      v-model:value="minutes"
      type="calculate"
      label="Minutes"
      @blur="timeChanged" 
    />
    
    <span class="text-2xl font-bold text-gray-400 dark:text-gray-500">
      :
    </span>

    <CustomInput
      v-model:value="seconds"
      type="calculate"
      label="Seconds"
      @blur="timeChanged" 
    />
  </div>
</template>

<style scoped>
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>
