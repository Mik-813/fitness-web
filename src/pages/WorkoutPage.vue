<script setup lang="ts">
import { computed, ref } from 'vue'
import * as endpoints from '$src/api/endpoints'
import DateSelector from '$src/components/DateSelector.vue'
import TimerComponent from '$src/components/workout/TimerComponent.vue'
import { customToast } from '$src/utils/custom-toast'

function getDateFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  const dateStr = urlParams.get('date')
  return dateStr ? new Date(dateStr) : undefined
}

const today = new Date(Date.now())
const currentDate = ref(getDateFromURL() ?? today)
const datesState = endpoints.getDatesRequest({ filter: 'exercises' }).use({})
const dates = computed(() => {
  const list = Object.keys(datesState.data).map(dateStr => new Date(dateStr))
  const hasToday = list.some(d => d.toDateString() === today.toDateString())
  const hasCurrentDate = list.some(d => d.toDateString() === currentDate.value.toDateString())
  if (!hasToday) list.push(today)
  if (currentDate.value.toDateString() != today.toDateString() && !hasCurrentDate)
    list.push(currentDate.value)
  return list
})

const handleRecord = (time: number) => {
  customToast.error(time.toString())
}
</script>

<template>
  <TimerComponent
    :limit="20"
    @record="handleRecord"
  />
  
  
  <div class="bg-linear-to-r from-grad-start to-grad-end">
    <DateSelector
      v-model="currentDate"
      :available-dates="dates"
    />
  </div>
</template>
