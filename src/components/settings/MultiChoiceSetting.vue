<script setup lang="ts" generic="T">
import DropdownButton from '$src/components/inputs/DropdownButton.vue'
import ParameterTemplate from '$src/components/settings/SettingLayout.vue'

defineProps<{
  title: string
  subtitle: string
  state: number
  items: Item<T>[]
  onSelect: (item: Item<T>) => void
}>()
</script>

<template>
  <ParameterTemplate
    :title="title"
    :subtitle="subtitle"
  >
    <div class="flex justify-end flex-2">
      <DropdownButton
        :items="items"
        :state="state"
        @select="onSelect"
      />
    </div>
  </ParameterTemplate>
</template>
