<script setup lang="ts">
import millify from 'millify'
import { computed, ref, watchEffect } from 'vue'

const props = defineProps<{
  consumables?: Consumable[]
  formula: (product: Consumable) => number
  title: string
}>()

const currentValue = ref(0) 
const maxValue = ref(0) 

watchEffect(() => {
  const result = props.consumables?.reduce(
    (acc, c) => acc + props.formula(c) * (c.consumption_g ?? 0),
    0,
  )

  if (result !== undefined && !isNaN(result)) {
    currentValue.value = result
  }
})

watchEffect(() => {
  const result = props.consumables?.reduce(
    (acc, c) => acc + props.formula(c) * (c.weight_g ?? 0),
    0,
  )

  if (result !== undefined && !isNaN(result)) {
    maxValue.value = result
  }
})

const progressPercentage = computed(() => currentValue.value && maxValue.value && (currentValue.value / maxValue.value) * 100)
const left = computed(() => currentValue.value && maxValue.value && maxValue.value - currentValue.value)
</script>

<template>
  <div class="flex flex-col gap-2 flex-1">
    <div class="font-semibold">
      {{ title }}
    </div>

    <div class="flex justify-between text-sm">
      <span>{{ millify(currentValue) }}</span>
      
      <Transition name="fade">
        <span v-if="left">
          {{ millify(left) }} left
        </span>
      </Transition>
    </div>

    <div class="w-full bg-white/20 rounded-full h-2 overflow-hidden">
      <div
        class="h-full bg-purple-300 rounded-full transition-all duration-500 ease-out"
        :style="{ width: Math.min(progressPercentage, 100) + '%' }"
      />
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
