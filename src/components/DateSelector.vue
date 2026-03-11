<script setup lang="ts">
import '@vuepic/vue-datepicker/dist/main.css'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import { useDateFormat } from '@vueuse/core'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import ChevronDownIcon from '$src/components/icons/ChevronDownIcon.vue'
import DateIcon from '$src/components/icons/DateIcon.vue'

const router = useRouter()

const props = defineProps<{
  modelValue: Date
  availableDates: Date[]
}>()

const emit = defineEmits<(e: 'update:modelValue', value: Date) => void>()

const sortedDates = computed(() => [...props.availableDates].sort((a, b) => a.getTime() - b.getTime()))

const currentIndex = computed(() => sortedDates.value.findIndex(
  (d) => d.toDateString() === props.modelValue.toDateString(),
))
function updateDateInURL(date: Date) {
  const formatted = useDateFormat(date, 'YYYY-MM-DD').value

  router.push({
    query: {
      ...router.currentRoute.value.query,
      date: formatted,
    },
  })
}

const prevDate = () => {
  if (currentIndex.value > 0) {
    const date = sortedDates.value[currentIndex.value - 1]
    updateDateInURL(date)
    emit('update:modelValue', date)
  }
}

const nextDate = () => {
  if (currentIndex.value < sortedDates.value.length - 1) {
    const date = sortedDates.value[currentIndex.value + 1]
    updateDateInURL(date)
    emit('update:modelValue', date)
  }
}

const formattedDate = computed(() => useDateFormat(props.modelValue, 'DD.MM.YYYY').value)
const isPrevDisabled = computed(() => currentIndex.value <= 0)
const isNextDisabled = computed(() => currentIndex.value === -1 || currentIndex.value >= sortedDates.value.length - 1)
</script>

<template>
  <div class="flex justify-center">
    <div class="flex items-center gap px-3">
      <button 
        :disabled="isPrevDisabled"
        class="disabled:text-grad-text/30 text-grad-text/70 hover:text-grad-text transition-colors p-1"
        @click="prevDate"
      >
        <ChevronDownIcon class-name="size-5 rotate-90" />
      </button>

      <VueDatePicker
        :model-value="modelValue"
        :allowed-dates="availableDates"
        :enable-time-picker="false" 
        auto-apply
        hide-input-icon
        @update:model-value="(val) => updateDateInURL(new Date(val))"
      >
        <template #trigger>
          <button 
            v-auto-animate 
            class="normal-nums flex items-center justify-center gap-2 px-2 py-1 hover:bg-grad-text/10 transition-colors rounded text-white"
          >
            <DateIcon />

            <span class="tabular-nums font-medium tracking-tight">
              {{ formattedDate }}
            </span>
          </button>
        </template>
      </VueDatePicker>

      <button 
        :disabled="isNextDisabled"
        class="disabled:text-grad-text/30 text-grad-text/70 hover:text-grad-text transition-colors p-1"
        @click="nextDate"
      >
        <ChevronDownIcon class-name="size-5 rotate-270" />
      </button>
    </div>
  </div>
</template>

<style>
.dp__button_bottom {
  display: none;
}

.dp__theme_light {
  --dp-background-color: transparent;
  --dp-text-color: var(--color-grad-text);             
  --dp-secondary-color: var(--color-grad-text-dimmed); 
  --dp-disabled-color: rgba(229, 229, 247, 0.3);       
  --dp-icon-color: var(--color-grad-text);
  --dp-border-color: rgba(255, 255, 255, 0.1);         
  --dp-menu-border-color: rgba(255, 255, 255, 0.2);    
  --dp-primary-color: #ffffff;
  --dp-primary-text-color: var(--color-grad-end);      
  --dp-hover-color: rgba(255, 255, 255, 0.15);         
  --dp-hover-text-color: #ffffff;
  --dp-hover-icon-color: var(--color-grad-text); 
  transition: color 0.2s ease-in-out;
}

.dp__theme_light .dp__btn:hover {
  color: var(--color-grad-text); 
}

.dp__menu {
  background: linear-gradient(135deg, var(--color-grad-start), var(--color-grad-end));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(77, 55, 239, 0.3);
  
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dp__calendar_header_item {
  color: var(--color-grad-text-dimmed);
  font-weight: 600;
}

.dp__overlay {
  background: linear-gradient(135deg, var(--color-grad-start), var(--color-grad-end));
  border-radius: 12px; 
}

.dp__action_row {
  background: transparent; 
}

.dp__overlay_container {
  background: transparent;
}

.dp__arrow_top {
  display: none;
}

.dp__calendar_item {
  border-radius: 5px;
  background: color-mix(in srgb, var(--color-grad-text), transparent 85%);
  margin: 2px;
}

.dp__calendar_item[aria-disabled="true"], .dp__calendar_item[aria-selected="true"] {
  background: transparent;
}

.dp__cell_offset {
  visibility: hidden !important;
  pointer-events: none;
  user-select: none;
}
</style>
