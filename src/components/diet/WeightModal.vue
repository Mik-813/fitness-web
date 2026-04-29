<script setup lang="ts">
import { ref } from 'vue'
import CustomInput from '$src/components/inputs/CustomInput.vue'
import ModalWindow from '$src/components/reusable/ModalWindow.vue'

const props = defineProps<{ onSubmit: (weight: number) => void, }>()

const weightStr = ref('')

function handleSubmit() {
  const weight = Number(weightStr.value)
  if (weight > 0) {
    props.onSubmit(weight)
  }
}
</script>

<template>
  <ModalWindow title="Add Weight">
    <div class="flex flex-col gap-4 px-1.5 py-2">
      <CustomInput
        v-model:value="weightStr"
        type="calculate"
        label="Weight (g)"
        autofocus
        @enter-down="handleSubmit"
      />
    </div>
  </ModalWindow>
</template>
