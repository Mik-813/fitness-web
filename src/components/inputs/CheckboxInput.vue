<script setup lang="ts">
import CheckIcon from '$src/components/icons/CheckIcon.vue'

const props = defineProps<{
  modelValue: boolean
  label?: string
  disabled?: boolean
}>()

const emit = defineEmits<(e: 'update:modelValue', value: boolean) => void>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<template>
  <label
    class="flex items-center gap-1.5 select-none"
    :class="disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'"
  >
    <div class="relative flex items-center justify-center">
      <input
        type="checkbox"
        class="peer sr-only"
        :checked="modelValue"
        :disabled="disabled"
        @change="handleChange"
      >
      
      <div
        class="w-5 h-5 flex items-center justify-center rounded border transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2"
        :class="[
          modelValue
            ? 'bg-primary border-primary '
            : 'bg-pane-bg border-pane-text-dimmed hover:border-primary'
        ]"
      >
        <CheckIcon
          :class-name="`
            stroke-3 size-3.5 text-grad-text
            ${(props.modelValue ? 'scale-100 opacity-100' : 'opacity-0')}
          `"
        />
      </div>
    </div>

    <span
      v-if="label"
      class="text-sm font-medium text-pane-text"
    >
      {{ label }}
    </span>

    <slot v-else />
  </label>
</template>
