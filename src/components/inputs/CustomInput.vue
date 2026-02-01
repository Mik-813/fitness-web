<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 1. Props & Two-Way Binding ($bindable translation)
// defineModel requires Vue 3.4+. It creates a ref that syncs with the parent.
const value = defineModel<string | number>('value')
const error = defineModel<string>('error', { default: '' })

// 2. Standard Props and Event Callbacks
const props = withDefaults(
  defineProps<{
    initFocus?: boolean
    label?: string
    placeholder?: string
    type?: string
    // Retaining function props to match your exact Svelte interface
    onFocus?: () => void
    onBlur?: () => void
    onInput?: (value: string) => void
    onChange?: (value: string) => void
    onKeyDown?: (key: string) => void
  }>(), 
  { type: 'text' },
)

// 3. Local State (Refs)
const isFocused = ref(false)
const inputElement = ref<HTMLInputElement | null>(null)

// 4. Computed State ($derived translation)
const hasValue = computed(() => value.value !== undefined && value.value !== '')
const isActive = computed(() => isFocused.value || hasValue.value)

// 5. Lifecycle (onMount translation)
onMounted(() => {
  if (props.initFocus) {
    inputElement.value?.focus()
  }
})

// 6. Handlers
// We separate these to keep the template clean and handle type casting
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    (e.target as HTMLInputElement).blur()
  }
  props.onKeyDown?.(e.key)
}

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  // Note: v-model handles the value update automatically
  props.onInput?.(target.value)
}

function handleChange(e: Event) {
  const target = e.target as HTMLInputElement
  props.onChange?.(target.value)
}

function handleFocus() {
  isFocused.value = true
  props.onFocus?.()
}

function handleBlur() {
  isFocused.value = false
  props.onBlur?.()
}
</script>

<template>
  <div class="flex flex-col gap-0">
    <div class="relative py-2">
      <label
        for="inputField"
        class="absolute left-3 pointer-events-none transition-all duration-200 ease-in-out"
        :class="[
          error 
            ? 'text-red-500' 
            : isFocused 
              ? 'text-purple-600' 
              : 'text-gray-500',
          isActive
            ? 'top-0 text-xs font-medium bg-white px-1'
            : 'top-1/2 -translate-y-1/2 text-sm'
        ]"
      >
        {{ label }}
      </label>

      <input
        id="inputField"
        ref="inputElement"
        v-model="value"
        :type="type"
        :placeholder="placeholder"
        class="w-full border bg-white focus:ring-2 focus:border-transparent rounded px-3 py-3 transition-all duration-200 outline-none text-sm"
        :class="[
          error 
            ? 'border-red-200 focus:ring-red-500' 
            : 'border-gray-200 focus:ring-purple-600'
        ]"
        @keydown="handleKeyDown"
        @change="handleChange"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      >
    </div>
    
    <span class="text-xs text-red-500 px-1 pb-2">
      {{ error }}
    </span>
  </div>
</template>
