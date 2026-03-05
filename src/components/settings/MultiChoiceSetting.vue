<script setup lang="ts" generic="T">
import DropdownButton from '$src/components/inputs/DropdownButton.vue'
import ParameterTemplate from '$src/components/settings/SettingLayout.vue'

defineProps<{
  title: string
  subtitle: string
  initialIndex?: number
  items: Item<T>[]
}>()

const emit = defineEmits<(e: 'select', item: Item<T>) => void>()
</script>

<template>
  <ParameterTemplate
    :title="title"
    :subtitle="subtitle"
  >
    <div class="flex justify-end flex-2">
      <DropdownButton
        :items="items"
        :initial-index="initialIndex"
        @select="emit('select', $event)"
      />
    </div>
  </ParameterTemplate>
</template>
