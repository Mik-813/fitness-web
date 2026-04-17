<script setup lang="ts">
import { ref } from 'vue'
import CustomInput from '$src/components/inputs/CustomInput.vue'

const props = defineProps<{ onChange: (seconds: number) => void, }>()

const minutes = ref(0)
const seconds = ref(0)

const timeChanged = () => {
  if (minutes.value < 0) minutes.value = 0
  if (seconds.value < 0) seconds.value = 0
  if (seconds.value > 59) seconds.value = 59

  props.onChange(minutes.value * 60 + seconds.value)
}
</script>

<template>
  <div class="flex items-center gap-2">
    <CustomInput
      v-model:value="minutes"
      type="calculate"
      label="Rest minutes"
      @blur="timeChanged" 
    />
    
    <span class="text-2xl font-bold text-gray-400 dark:text-gray-500">
      :
    </span>

    <CustomInput
      v-model:value="seconds"
      type="calculate"
      label="Rest seconds"
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
