import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import SplashscreenView from '@/views/SplashscreenView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import SignupView from '@/views/SignupView.vue'
import GuruSignUpView from '@/views/GuruSignUpView.vue'

const router = createRouter({
          history: createWebHistory(import.meta.env.BASE_URL),
          routes: [
                    {
                              path: '/register-guru',
                              name: 'guru-signup',
                              component: GuruSignUpView,
                    },
                    {
                              path: '/',
                              name: 'login',
                              component: LoginView,
                    },
                    {
                              path: '/register',
                              name: 'signup',
                              component: SignupView,
                    },
                    {
                              path: '/dashboard',
                              name: 'dashboard',
                              component: DashboardView,
                              meta: { requiresAuth: true }, // 🔹 Added authentication requirement
                    },
                    {
                              path: '/splash',
                              name: 'splashscreen',
                              component: SplashscreenView,
                              meta: { requiresAuth: true }, // 🔹 Added authentication requirement
                    },
                    {
                              path: '/:catchAll(.*)',
                              name: 'not-found',
                              component: NotFoundView,
                    },
          ],
})

const redirectByRole = {
          guru: '/dashboard',
          siswa: '/splash',
}

router.beforeEach(async (to, from, next) => {
          try {
                    const response = await axios.get('/api/session')
                    const isLoggedIn = response.data.loggedIn
                    const user = response.data.user || { nama: undefined }

                    console.log(user.nama, to.name)

                    if (
                              to.meta.requiresAuth &&
                              !isLoggedIn &&
                              to.path !== '/'
                    ) {
                              console.log('Redirecting to login...')
                              next('/')
                    } else if (
                              (to.name === 'login' || to.name === 'signup') &&
                              isLoggedIn
                    ) {
                              next(redirectByRole[user.role])
                    } else if (
                              to.name === 'splashscreen' &&
                              user.role === 'guru'
                    ) {
                              next('/dashboard')
                    } else if (
                              to.name === 'dashboard' &&
                              user.role === 'siswa'
                    ) {
                              next('/splash')
                    } else {
                              next()
                    }
          } catch (error) {
                    console.error('Auth check failed:', error)
                    next('/')
          }
})

export default router
