import { computed, ref } from 'vue'

export const timerElapsedMs = ref(0)
export const timerSeconds = computed(() => timerElapsedMs.value / 1000 >> 0)
export const timerRunning = ref(false)

let intervalId: ReturnType<typeof setInterval> | null = null

export function stopTimer() {
  timerRunning.value = false
  if (intervalId) clearInterval(intervalId)
  timerElapsedMs.value = 0
}

export const startTimer = (forceRestart = false) => {
  if (timerRunning.value && !forceRestart) return
  
  timerRunning.value = true
  if (intervalId) clearInterval(intervalId) 
  
  intervalId = setInterval(
    () => {
      timerElapsedMs.value += 10
    }, 
    10,
  )
}

export function pauseTimer(){
  if (!timerRunning.value) return
  timerRunning.value = false
  if (intervalId) clearInterval(intervalId)
}
