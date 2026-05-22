<script setup lang="ts">
import { Parser } from 'expr-eval'
import { ref, computed, onMounted } from 'vue'
import EyeIcon from '$src/components/icons/EyeIcon.vue'

const value = defineModel<string | number | undefined | null>('value')

const props = defineProps<{
  initFocus?: boolean
  label?: string
  placeholder?: string
  type?: 'text' | 'number' | 'calculate' | 'password'
  error?: string
  forceLabelActive?: boolean
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
const isActive = computed(() => props.forceLabelActive || isFocused.value || hasValue.value)

const passwordVisible = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return passwordVisible.value ? 'text' : 'password'
  }
  return 'text'
})

function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value
}

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

function randomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const uniqueId = randomString(8)
</script>

<template>
  <div class="flex flex-col gap-0">
    <div class="relative py-2">
      <label
        :for="uniqueId"
        class="absolute left-3 pointer-events-none transition-all duration-200 ease-in-out"
        :class="[
          mergedError 
            ? 'text-red-500' 
            : isFocused 
              ? 'text-primary' 
              : 'text-gray-500',
          isActive
            ? 'top-0 text-xs font-medium bg-pane-bg px-1'
            : 'top-1/2 -translate-y-1/2 text-sm'
        ]"
      >
        {{ label }}
      </label>

      <input
        :id="uniqueId"
        ref="inputElement"
        :value="value"
        :type="inputType"
        class="w-full ring-1 ring-primary/10 bg-pane-bg focus:ring-2 rounded-lg px-3 py-3 transition-all duration-200 outline-none text-sm placeholder:text-xs placeholder:text-gray-400"
        :placeholder="placeholder"
        :class="[
          mergedError 
            ? 'border-red-200 focus:ring-red-500' 
            : 'border-gray-200 focus:ring-primary',
          props.type === 'password' ? 'pr-10' : ''
        ]"
        @keydown="handleKeyDown"
        @change="handleChange"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      >

      <button
        v-if="props.type === 'password'"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
        @click="togglePasswordVisibility"
      >
        <EyeIcon
          :mode="passwordVisible ? 'normal' : 'slashed'"
          class-name="w-5 h-5 stroke-2"
        />
      </button>
    </div>
    
    <span
      v-if="mergedError"
      class="text-xs text-red-500 px-1"
    >
      {{ mergedError }}
    </span>
  </div>
</template>
