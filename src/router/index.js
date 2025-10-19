import { createRouter, createWebHistory } from 'vue-router'
import { useSessionDataStore } from '@/stores/SessionData'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import ItemCreateView from '@/views/ItemCreateView.vue'
import ItemsView from '@/views/ItemsView.vue'
import SpeechToTextRecog from '@/components/SpeechToTextRecog.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      meta: { requiresGuest: true }
    },
    {
      path: '/items/create',
      name: 'item registration',
      component: ItemCreateView,
      meta: { requiresAuth: true }
    },
    {
      path: '/items',
      name: 'items',
      component: ItemsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/stt',
      name: 'speach-to-text',
      component: SpeechToTextRecog,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to) => {
  const sessionData = useSessionDataStore()

  const authService = (await import('@/services/AuthService')).default
  await authService.waitForInit()

  const authState = authService.getAuthState()
  sessionData.writeData(authState)

  const isAuthenticated = sessionData.logged

  // Редирект авторизованных пользователей с главной
  if (to.name === 'home' && isAuthenticated) {
    return { name: 'items' }
  }

  // Редирект авторизованных пользователей с логина/регистрации
  if (to.meta.requiresGuest && isAuthenticated) {
    return { name: 'items' }
  }

  // Редирект неавторизованных пользователей с защищенных страниц
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'home' }
  }
})

export default router
