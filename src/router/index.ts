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

  // requiresAdmin implies requiresAuth -- an admin route needs a session first.
  if ((to.meta.requiresAuth || to.meta.requiresAdmin) && !auth.isAuthenticated) {
    return '/login'
  }
  // Signed in but not an admin: send them somewhere harmless. If you turn
  // this whole app into an admin panel (every route requiresAdmin), point
  // this redirect at a dedicated NON-admin "no access" page instead --
  // otherwise a non-admin bounces in a loop and the router aborts with an
  // infinite-redirect error.
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return '/'
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return '/'
  }
})

export default router
