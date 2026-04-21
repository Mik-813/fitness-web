<script setup lang="ts">
import { computed } from 'vue'
import StopIcon from '../icons/StopIcon.vue'
import PauseIcon from '$src/components/icons/PauseIcon.vue'
import PlayIcon from '$src/components/icons/PlayIcon.vue'
import { timerElapsedMs, timerSeconds, timerRunning, pauseTimer, startTimer, stopTimer } from '$src/states/timer'

const props = defineProps<{ limit?: number, }>()

const formattedTimeParts = computed(() => {
  const totalSeconds = Math.floor(timerElapsedMs.value / 1000)
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const s = (totalSeconds % 60).toString().padStart(2, '0')
  const ms = Math.floor((timerElapsedMs.value % 1000) / 10).toString().padStart(2, '0')
  return {
    m,
    s,
    ms, 
  }
})

const timeColorClass = computed(() => {
  if (!props.limit) return 'text-white'
  
  if (timerSeconds.value > props.limit) {
    return 'text-white bg-red-500/70'
  }
  else if (timerSeconds.value >= props.limit - 10) {
    return 'text-white bg-yellow-500/80'
  }
  
  return 'text-white'
})

function toggleTimer() {
  timerRunning.value ? pauseTimer() : startTimer()
}

function toggleAutostart() {
  if (timerRunning.value) {
    pauseTimer()
  }
  else {
    startTimer(true)
  }
}
</script>

<template>
  <div class="flex justify-center items-center gap-4 px-4 py-3 bg-linear-to-r from-grad-start to-grad-end select-none">
    <!-- <button
      class="p-1 rounded-md transition-colors"
      :class="isAutostart ? 'bg-grad-text/20 text-[#C1FF24]' : 'text-white'"
      aria-label="Toggle Autostart"
      @click.stop="toggleAutostart"
    >
      <ArrowPathSquareIcon class-name="stroke-2 size-7" />
    </button> -->
    

    <button 
      class="p-1 rounded-md text-grad-text duration-200 transition-colors"
      :class="timerRunning ? ' bg-grad-text/20' : 'hover:bg-grad-text/10'"
      aria-label="Play or Pause"
      @click.stop="toggleTimer"
    >
      <PauseIcon
        v-if="timerRunning"
        class-name="stroke-2 size-7"
      />

      <PlayIcon
        v-else
        class-name="stroke-2 size-7"
      />
    </button>

    <div 
      class="text-lg font-bold bg-black/20 w-full max-w-96 text-center p-2.5 rounded-lg duration-200 border border-secondary transition-colors"
      :class="timeColorClass"
    >
      <span class="flex items-baseline justify-center tabular-nums">
        {{ formattedTimeParts.m }}:{{ formattedTimeParts.s }}
        <span class="text-sm">
          .{{ formattedTimeParts.ms }}
        </span>
      </span>
    </div>

    <button
      class="p-1 rounded-md text-grad-text duration-200 transition-colors hover:bg-grad-text/10"
      aria-label="Stop"
      @click.stop="stopTimer"
    >
      <StopIcon class-name="stroke-2 size-7" />
    </button>
  </div>
</template>
