import { createRouter, createWebHistory } from 'vue-router'
import DietPage from '$src/pages/DietPage.vue'
import MyHome from '$src/pages/MyHome.vue'
import NotFound from '$src/pages/NotFound.vue'
import StatisticsChart from '$src/pages/StatisticsChart.vue'
import TrainingPage from '$src/pages/WorkoutPage.vue'

export const paths = {
  home: '/',
  statistics: '/statistics',
  diet: '/diet',
  workout: '/workout',
  exercises: '/workout/exercises',
  exercise: (id: number | string) => `/workout/exercises/${id}`,
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
    component: TrainingPage, 
  },
  {
    path: paths.exercises,
    component: TrainingPage, 
  },
  {
    path: paths.exercise(':id'),
    component: TrainingPage, 
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
