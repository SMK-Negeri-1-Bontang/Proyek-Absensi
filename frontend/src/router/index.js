import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import SplashscreenView from '@/views/SplashscreenView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import SignupView from '@/views/SignupView.vue'
import GuruSignUpView from '@/views/GuruSignUpView.vue'
import SiswaView from '@/views/SiswaView.vue'
import GuruView from '@/views/GuruView.vue'
import JurusanView from '@/views/JurusanView.vue'

// Router untuk redireksi
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
                              path: '/dashboard/absensi',
                              name: 'dashboard-absensi',
                              component: DashboardView,
                              meta: { requiresAuth: true }, // 🔹 Added authentication requirement
                    },
                    {
                              path: '/dashboard/siswa',
                              name: 'dashboard-siswa',
                              component: SiswaView,
                              meta: { requiresAuth: true }, // 🔹 Added authentication requirement
                    },
                    {
                              path: '/dashboard/guru',
                              name: 'dashboard-guru',
                              component: GuruView,
                              meta: { requiresAuth: true }, // 🔹 Added authentication requirement
                    },
                    {
                              path: '/dashboard/jurusan',
                              name: 'dashboard-jurusan',
                              component: JurusanView,
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

// Constant untuk redireksi sesuai role

const redirectByRole = {
          guru: '/dashboard/absensi',
          siswa: '/splash',
}

// Algoritme pengecekan kredensial user.
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
                              (to.name === 'login' ||
                                        to.name === 'signup' ||
                                        to.name === 'guru-signup') &&
                              isLoggedIn
                    ) {
                              next(redirectByRole[user.role])
                    } else if (
                              to.name === 'splashscreen' &&
                              user.role === 'guru'
                    ) {
                              next('/dashboard/absensi')
                    } else if (
                              to.path.startsWith('dashboard') &&
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
