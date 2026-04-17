<script setup lang="ts">
import { Parser } from 'expr-eval'
import { ref, computed, onMounted } from 'vue'

const value = defineModel<string | number | undefined | null>('value')

const props = defineProps<{
  initFocus?: boolean
  label?: string
  placeholder?: string
  type?: 'text' | 'number' | 'calculate'
  error?: string
  onFocus?: () => void
  onBlur?: () => void
  onInput?: (value: string) => void
  onChange?: (value: string) => void
  onEnterDown?: (key: string) => void
}>()

const internalError = ref('')
const mergedError = computed(() => internalError.value || props.error)

const isFocused = ref(false)
const inputElement = ref<HTMLInputElement | null>(null)

const hasValue = computed(() => value.value === 0 || value.value)
const isActive = computed(() => isFocused.value || hasValue.value)

onMounted(() => {
  if (props.initFocus) {
    inputElement.value?.focus()
  }
})

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    (e.target as HTMLInputElement).blur()
    props.onEnterDown?.(e.key)
  }
}

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  let inputValue = target.value
  
  if (props.type === 'number') {
    inputValue = inputValue.replace(/\D/g, '')
    target.value = inputValue 
    value.value = inputValue
    props.onInput?.(inputValue)
    return
  }

  if (props.type === 'calculate') {
    inputValue = inputValue.replace(/[^0-9+\-*/().]/g, '')
    try {
      inputValue = Parser.evaluate(inputValue).toString()
    }
    catch {}
    target.value = inputValue
    value.value = inputValue
    props.onInput?.(inputValue)
    return
  }
  
  value.value = inputValue
  props.onInput?.(inputValue)
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
          mergedError 
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
        :value="value"
        type="text"
        class="w-full border bg-white focus:ring-2 focus:border-transparent rounded-lg px-3 py-3 transition-all duration-200 outline-none text-sm"
        :placeholder="placeholder"
        :class="[
          mergedError 
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
    
    <span
      v-if="mergedError"
      class="text-xs text-red-500 px-1"
    >
      {{ mergedError }}
    </span>
  </div>
</template>
