import { computed } from 'vue'
import { endpoints } from '$src/api/endpoints'
import router, { paths } from '$src/router'

const today = new Date()

const filter = computed(() => {
  const path = router.currentRoute.value.path
  if (path.startsWith(paths.diet)) return 'consumables'
  if (path.startsWith(paths.workout)) return 'exercises'
  if (path.startsWith(paths.statistics)) return 'all'
  return 'all'
})

const datesState = computed(() => endpoints.getDates({ filter: filter.value }).use({}))

export const dates = computed(() => {
  const state = datesState.value
  const list = Object.keys(state.data ?? {}).map(dateStr => new Date(dateStr))
  
  const hasToday = list.some(d => d.toDateString() === today.toDateString())
  const hasCurrentDate = list.some(d => d.toDateString() === currentDate.value.toDateString())
  
  if (!hasToday) list.push(today)
  if (currentDate.value.toDateString() !== today.toDateString() && !hasCurrentDate)
    list.push(currentDate.value)
  return list
})


export const currentDate = computed(() => {
  const dateStr = router.currentRoute.value.query.date
  if (dateStr && typeof dateStr === 'string') {
    return new Date(dateStr)
  }
  return new Date()
})
