import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import { useAuthStore } from './stores/auth'
import App from './App.vue'
import './styles/theme.css'

const app = createApp(App)
app.use(createPinia())

const auth = useAuthStore()

// Initialize auth before mounting so the first route guard sees the
// correct session state. Errors here (network, CORS, misconfigured env)
// must not block the app from mounting -- otherwise the user sees a
// blank screen with no clue what went wrong.
auth.initialize().finally(() => {
  app.use(router)
  app.mount('#app')
})
