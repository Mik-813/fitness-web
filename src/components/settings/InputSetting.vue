<script setup lang="ts">
import CustomInput from '$src/components/inputs/CustomInput.vue'
import ParameterTemplate from '$src/components/settings/SettingLayout.vue'

defineProps<{
  title: string
  subtitle: string
  state?: string
  placeholder?: string
  onChange?: (value: string) => void
}>()
</script>

<template>
  <ParameterTemplate
    :title="title"
    :subtitle="subtitle"
  >
    <CustomInput
      class="w-32"
      :value="state"
      :placeholder
      @change="onChange"
    />
  </ParameterTemplate>
</template>
