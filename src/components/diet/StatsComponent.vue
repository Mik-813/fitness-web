<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { ref } from 'vue'
import UnitProgressbar from '$src/components/diet/UnitProgressbarComponent.vue'
import ChevronDownIcon from '$src/components/icons/ChevronDownIcon.vue'

interface Stat {
  title: string
  formula: (product: Product) => number
}

const props = defineProps<{
  stats: Stat[]
  consumables?: Consumable[] 
}>()

const currentIndex = ref(0)
const transitionName = ref('slide-left')

function nextStat() {
  transitionName.value = 'slide-left'
  currentIndex.value = (currentIndex.value + 1) % props.stats.length
}

function prevStat() {
  transitionName.value = 'slide-right'
  currentIndex.value = (currentIndex.value - 1 + props.stats.length) % props.stats.length
}
</script>

<template>
  <template v-if="stats && stats.length > 0">
    <div
      v-auto-animate
      class="flex-row text-white gap-4 w-full px-2"
      :class="stats.length === 1 ? 'flex' : 'hidden md:flex'"
    >
      <UnitProgressbar 
        v-for="(stat, index) in stats"
        :key="index"
        :consumables="consumables"
        :formula="stat.formula" 
        :title="stat.title" 
      />
    </div>

    <div 
      v-if="stats.length > 1"
      class="flex md:hidden items-center w-full text-white gap-2"
    >
      <button 
        class="text-grad-text/70 hover:text-grad-text transition-colors"
        @click="prevStat"
      >
        <ChevronDownIcon class-name="size-5 rotate-90" />
      </button>

      <div class="grid flex-1 relative select-none">
        <Transition :name="transitionName">
          <div 
            :key="currentIndex"
            class="col-start-1 row-start-1 w-full"
          >
            <UnitProgressbar 
              :consumables="consumables"
              :formula="stats[currentIndex].formula" 
              :title="stats[currentIndex].title" 
            />
          </div>
        </Transition>
      </div>

      <button 
        class="p-1 text-white/70 hover:text-white transition-colors"
        @click="nextStat"
      >
        <ChevronDownIcon class-name="size-5 -rotate-90" />
      </button>
    </div>
  </template>
</template>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.2s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
