// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        component: () => import('@/pages/HomePage.vue')
      },
      {
        path: '/searchMentors',
        name: 'MentorsSearching',
        component: () => import('@/pages/searching/MentorsSearchPage.vue')
      },
      {
        path: '/serchLessons',
        name: 'LessonsSearching',
        component: () => import('@/pages/searching/LessonsSearchPage.vue')
      },
      {
        path: '/searchClubs',
        name: 'ClubsSearching',
        component: () => import('@/pages/searching/ClubsSearchPage.vue')
      },
      {
        path: '/user/:id',
        name: 'Account',
        props: true,
        component: () => import('@/pages/account/AccountPage.vue')
      },
      {
        path: '/settings',
        name: 'AccountSettingsPage',
        component: () => import('@/pages/account/AccountSettingsPage.vue'),
        beforeEnter: async (to, from) => {
          let auth = useAuth()
          if (!auth.getAuthStatus()) {
            localStorage.setItem('requestedLink', to.fullPath)
            return '/login'
          }
        }
      },
      {
        path: '/myResponses',
        name: 'MyResponses',
        component: () => import('@/pages/account/MyResponsesPage.vue'),
        beforeEnter: async (to, from) => {
          let auth = useAuth()
          if (!auth.getAuthStatus()) {
            localStorage.setItem('requestedLink', to.fullPath)
            return '/login'
          }
        }
      },
      {
        path: '/myAchievements',
        name: 'MyAchievements',
        component: () => import('@/pages/account/MyAchievementsPage.vue'),
        beforeEnter: async (to, from) => {
          let auth = useAuth()
          if (!auth.getAuthStatus()) {
            localStorage.setItem('requestedLink', to.fullPath)
            return '/login'
          }
        }
      },
      {
        path: '/create',
        name: 'Create',
        component: () => import('@/pages/CreatingPage.vue'),
        beforeEnter: async (to, from) => {
          let auth = useAuth()
          if (!auth.getAuthStatus()) {
            localStorage.setItem('requestedLink', to.fullPath)
            return '/login'
          }
        }
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/pages/AboutProjectPage.vue')
      },
      {
        path: '/termsOfUse',
        name: 'TermsOfUse',
        component: () => import('@/pages/TermsOfUse.vue')
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/LoginPage.vue')
      },
      {
        path: '/registration',
        name: 'Registration',
        component: () => import('@/pages/RegistrationPage.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
