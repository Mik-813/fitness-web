<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import UnitProgressbar from '$src/components/diet/UnitProgressbarComponent.vue'

interface Stat {
  title: string
  formula: (product: Product) => number
}

defineProps<{
  stats: Stat[]
  consumables?: Consumable[] 
}>()
</script>

<template>
  <div
    v-auto-animate
    class="flex flex-col md:flex-row text-white gap-4 w-full"
  >
    <UnitProgressbar 
      v-for="(stat, index) in stats"
      :key="index"
      :consumables="consumables"
      :formula="stat.formula" 
      :title="stat.title" 
    />
  </div>
</template>
