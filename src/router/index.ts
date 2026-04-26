import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/login', component: Login, meta: { guestOnly: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return '/'
  }
})

export default router
