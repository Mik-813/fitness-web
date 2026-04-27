import { createRouter, createWebHistory } from 'vue-router'
import AuthPage from '$src/pages/AuthPage.vue'
import DietPage from '$src/pages/DietPage.vue'
import NotFound from '$src/pages/NotFound.vue'
import StatisticsChart from '$src/pages/StatisticsChart.vue'
import WorkoutPage from '$src/pages/WorkoutPage.vue'

export const paths = {
  home: '/',
  statistics: '/statistics',
  diet: '/diet',
  workout: '/workout',
  notFound: '/:pathMatch(.*)*',
}

const routes = [
  {
    path: paths.home,
    component: AuthPage, 
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

router.beforeEach((to, from) => {
  const isAuthenticated = !!localStorage.getItem('token')
  if (to.path === paths.home && isAuthenticated) {
    return paths.diet
  }
  if (to.path !== paths.home && !isAuthenticated) {
    return paths.home
  }
})

router.isReady().then(() => {
  const path = localStorage.getItem('path')
  if (!path) return
  router.replace(path)
  localStorage.removeItem('path')
})

export default router
