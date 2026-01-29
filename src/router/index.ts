import { createRouter, createWebHistory } from 'vue-router'
import DietPage from '$src/pages/DietPage.vue'
import MyHome from '$src/pages/MyHome.vue'
import NotFound from '$src/pages/NotFound.vue'
import StatisticsChart from '$src/pages/StatisticsChart.vue'
import TrainingPage from '$src/pages/TrainingPage.vue'

export const routeNames = {
  home: 'home',
  statistics: 'statistics',
  diet: 'diet',
  training: 'training',
  notFound: 'notFound',
}

const routes = [
  {
    path: '/',
    name: routeNames.home,
    component: MyHome, 
  },
  {
    path: '/'+routeNames.statistics,
    name: routeNames.statistics,
    component: StatisticsChart, 
  },
  {
    path: '/'+routeNames.diet,
    name: routeNames.diet,
    component: DietPage, 
  },
  {
    path: '/'+routeNames.training,
    name: routeNames.training,
    component: TrainingPage, 
  },
  {
    path: '/:pathMatch(.*)*',
    name: routeNames.notFound,
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
