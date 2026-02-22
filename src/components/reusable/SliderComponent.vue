<script setup lang="ts">
import convert, { type Unit } from 'convert-units'
import { ref, computed } from 'vue'
import CustomInput from '$src/components/inputs/CustomInput.vue'
import Modal from '$src/components/reusable/ModalWindow.vue'
import { debounce, throttle } from '$src/utils/timers'

const props = defineProps({
  currentValue: {
    type: Number,
    default: 0, 
  },
  maxValue: {
    type: Number,
    default: 1, 
  },
  onCurrentValueChange: {
    type: Function,
    required: true, 
  },
  onMaxValueChange: {
    type: Function,
    required: true, 
  },
})

const showTooltip = ref(false)
const isMaxValueModalVisible = ref(false)
const expression = ref(`${props.maxValue ?? ''}`)
const evaluationError = ref('')

const prettifiedCurrentValue = computed(() => prettify(props.currentValue, 'g'))
const prettifiedMaxValue = computed(() => prettify(props.maxValue, 'g'))

const debounceShowTooltip = debounce(() => (showTooltip.value = false), 200)

function prettify(value: number, unitFrom: Unit) {
  const obj = convert(value || 1)
    .from(unitFrom)
    .toBest()
  if (value === 0) obj.val = 0
  return obj.val + obj.unit
}

function onThumbMove() {
  if (document.activeElement instanceof HTMLInputElement) {
    document.activeElement.blur()
  }
  showTooltip.value = true
  debounceShowTooltip()
}

const throttledOnSliderInput = throttle(
  (e: Event) => {
    const target = e.target as HTMLInputElement
    onThumbMove()
    props.onCurrentValueChange(Number(target.value))
  },
  10,
)
</script>

<template>
  <div class="px-1 relative">
    <Transition name="fade">
      <div
        v-if="showTooltip"
        class="absolute -top-12 transform -translate-x-1/2 transition-all duration-150 ease-out"
        :style="{ left: `${2.4 + (currentValue / maxValue) * 95.2}%` }"
      >
        <div class="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
          <span>
            {{ ((currentValue / maxValue) * 100) >> 0 }}%
          </span>

          <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
        </div>
      </div>
    </Transition>

    <div class="relative">
      <input
        id="budget"
        type="range"
        min="0"
        :max="maxValue"
        :value="Math.min(currentValue, maxValue)"
        class="w-full h-2 bg-purple-100 rounded-full appearance-none cursor-pointer slider"
        :style="{
          background: `linear-gradient(to right,
          #8b5cf6 0%,
          #8b5cf6 ${(currentValue / maxValue) * 100}%,
          #e9d5ff ${(currentValue / maxValue) * 100}%,
          #e9d5ff 100%)`
        }"
        @input="throttledOnSliderInput"
      >
    </div>

    <div class="flex justify-between text-sm mt-2">
      <span class="text-gray-600">
        {{ prettifiedCurrentValue }}
      </span>

      <span class="text-gray-600">
        {{ prettifiedMaxValue }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.6);
}

.slider::-moz-range-thumb {
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.slider::-webkit-slider-track {
  height: 12px;
  border-radius: 6px;
  background: transparent;
}

.slider::-moz-range-track {
  height: 12px;
  border-radius: 6px;
  background: transparent;
  border: none;
}

.slider:focus {
  outline: none;
}

.slider:focus::-webkit-slider-thumb {
  box-shadow:
    0 0 0 4px rgba(139, 92, 246, 0.2),
    0 4px 12px rgba(139, 92, 246, 0.4);
}

.slider:focus::-moz-range-thumb {
  box-shadow:
    0 0 0 4px rgba(139, 92, 246, 0.2),
    0 4px 12px rgba(139, 92, 246, 0.4);
}
</style>
