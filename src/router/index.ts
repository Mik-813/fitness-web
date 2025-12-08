import { createRouter, createWebHistory } from 'vue-router'
import MyAbout from '$src/pages/MyAbout.vue'
import MyHome from '$src/pages/MyHome.vue'
import NotFound from '$src/pages/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MyHome, 
  },
  {
    path: '/about',
    name: 'About',
    component: MyAbout, 
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
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
