<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import ArrowPathSquareIcon from '$src/components/icons/ArrowPathSquareIcon.vue'
import PauseIcon from '$src/components/icons/PauseIcon.vue'
import PlayIcon from '$src/components/icons/PlayIcon.vue'

const props = defineProps<{ limit?: number, }>()

const emit = defineEmits<(e: 'record', timeAllocated: number) => void>()

const timeElapsed = ref(0)
const isRunning = ref(false)
const isAutostart = ref(false)
let intervalId: ReturnType<typeof setInterval> | null = null

const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    (el as any).clickOutsideEvent = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    setTimeout(
      () => {
        document.addEventListener('click', (el as any).clickOutsideEvent)
      }, 
      0,
    )
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', (el as any).clickOutsideEvent)
  },
}

const formattedTime = computed(() => {
  const m = Math.floor(timeElapsed.value / 60).toString().padStart(2, '0')
  const s = (timeElapsed.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const timeColorClass = computed(() => {
  if (!props.limit) return 'text-white'
  
  if (timeElapsed.value > props.limit) {
    return 'text-white bg-red-500/50'
  }
  else if (timeElapsed.value >= props.limit - 10) {
    return 'text-white bg-yellow-500/50'
  }
  
  return 'text-white'
})

const startTimer = (forceRestart = false) => {
  if (isRunning.value && !forceRestart) return
  
  isRunning.value = true
  if (intervalId) clearInterval(intervalId) 
  
  intervalId = setInterval(
    () => {
      timeElapsed.value++
    }, 
    1000,
  )
}

const stopTimer = () => {
  if (!isRunning.value) return
  isRunning.value = false
  if (intervalId) clearInterval(intervalId)
}

const toggleTimer = () => {
  if (isRunning.value) {
    stopTimer()
  }
  else {
    startTimer()
  }
}

const toggleAutostart = () => {
  isAutostart.value = !isAutostart.value
  
  if (isAutostart.value) {
    emit('record', timeElapsed.value)
    timeElapsed.value = 0
    startTimer(true)
  }
}

const handleOutsideClick = () => {
  if (!isAutostart.value) return

  emit('record', timeElapsed.value)
  timeElapsed.value = 0
  startTimer(true)
}

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div 
    v-click-outside="handleOutsideClick"
    class="flex justify-center items-center gap-4 px-4 py-3 bg-linear-to-r from-grad-start to-grad-end select-none"
  >
    <button
      class="p-1 rounded-md transition-colors"
      :class="isAutostart ? 'bg-grad-text/20 text-[#C1FF24]' : 'text-white'"
      aria-label="Toggle Autostart"
      @click.stop="toggleAutostart"
    >
      <ArrowPathSquareIcon class-name="stroke-2 size-7" />
    </button>

    <div 
      class="text-lg font-bold bg-black/20 w-full max-w-96 text-center p-2.5 rounded-lg duration-200 border border-secondary transition-colors"
      :class="timeColorClass"
    >
      {{ formattedTime }}
    </div>

    <button 
      class="p-1 rounded-md text-grad-text duration-200 transition-colors"
      :class="isRunning ? ' bg-grad-text/20' : 'hover:bg-grad-text/10'"
      aria-label="Play or Pause"
      @click.stop="toggleTimer"
    >
      <PauseIcon
        v-if="isRunning"
        class-name="stroke-2 size-7"
      />

      <PlayIcon
        v-else
        class-name="stroke-2 size-7"
      />
    </button>
  </div>
</template>
