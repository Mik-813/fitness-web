import { createRouter, createWebHistory } from 'vue-router'
import DietPage from '$src/pages/DietPage.vue'
import ExercisePage from '$src/pages/ExercisePage.vue'
import MyHome from '$src/pages/MyHome.vue'
import NotFound from '$src/pages/NotFound.vue'
import StatisticsChart from '$src/pages/StatisticsChart.vue'
import WorkoutExercises from '$src/pages/WorkoutExercises.vue'
import WorkoutPage from '$src/pages/WorkoutPage.vue'

export const paths = {
  home: '/',
  statistics: '/statistics',
  diet: '/diet',
  workout: '/workout',
  exercises: '/workout/exercises',
  exercise: (id: number | string) => `/workout/exercise/${id}`,
  notFound: '/:pathMatch(.*)*',
}

const routes = [
  {
    path: paths.home,
    component: MyHome, 
  },
  {
    path: paths.statistics,
    component: StatisticsChart, 
  },
  {
    path: paths.diet,
    component: DietPage, 
  },
  {
    path: paths.workout,
    component: WorkoutPage, 
  },
  {
    path: paths.notFound,
    component: NotFound, 
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.isReady().then(() => {
  const path = localStorage.getItem('path')
  if (!path) return
  router.replace(path)
  localStorage.removeItem('path')
})

export default router
