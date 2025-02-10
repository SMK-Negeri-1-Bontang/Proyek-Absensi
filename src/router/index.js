import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import SplashscreenView from '@/views/SplashscreenView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import SignupView from '@/views/SignupView.vue'

const router = createRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: [
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
                },
                {
                        path: '/splash',
                        name: 'splashscreen',
                        component: SplashscreenView,
                },
                {
                        path: '/:catchAll(.*)',
                        name: 'not-found',
                        component: NotFoundView,
                },
        ],
})

export default router
