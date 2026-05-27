import { createRouter, createWebHistory } from 'vue-router'
import AuthPage from '$src/pages/AuthPage.vue'
import DietPage from '$src/pages/DietPage.vue'
import NotFound from '$src/pages/NotFound.vue'
import StatisticsChart from '$src/pages/StatisticsChart.vue'
import VerificationPage from '$src/pages/VerificationPage.vue'
import VerificationStatusPage from '$src/pages/VerificationStatusPage.vue'
import WorkoutPage from '$src/pages/WorkoutPage.vue'

export const paths = {
  home: '/',
  auth: '/auth',
  statistics: '/statistics',
  diet: '/diet',
  workout: '/workout',
  verification: '/verification',
  verificationStatus: '/verification/status',
  notFound: '/:pathMatch(.*)*',
}

const routes = [
  {
    path: paths.auth,
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
    path: paths.verification,
    component: VerificationPage, 
  },
  {
    path: paths.verificationStatus,
    component: VerificationStatusPage, 
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
  if (to.path === paths.home) {
    if (localStorage.getItem('token')) {
      return paths.diet
    }
    return paths.auth
  }
})

export default router
