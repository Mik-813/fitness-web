<script setup lang="ts">
import SwitchToggle from '$src/components/inputs/SwitchToggle.vue'
import ParameterTemplate from '$src/components/settings/SettingLayout.vue'

defineProps<{
  title: string
  subtitle: string
  initialState?: boolean
  onToggled: (isActive: boolean) => void
}>()

defineEmits<(e: 'toggled', isActive: boolean) => void>()
</script>

<template>
  <ParameterTemplate
    :title="title"
    :subtitle="subtitle"
  >
    <SwitchToggle 
      :initial-state="initialState"
      @toggled="onToggled"
    />
  </ParameterTemplate>
</template>
