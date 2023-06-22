import { onMounted } from 'vue'
import { createRouter, createWebHistory, RouteLocation, RouteRecordRaw } from 'vue-router'
import RolesService from '../services/RolesService'
import { useAuth } from '../stores/auth'

function checkAuth(): string|void {
  onMounted(() => {
    let auth = useAuth()
    if (!auth.getAuthStatus()) {
      return '/login'
    }
  })
}

function checkAdmin(to: RouteLocation, from: RouteLocation): string|void {
  onMounted(() => {
    let auth = useAuth()
    let user = auth.getUser()
  
    if(!user || (user && !RolesService.isSomeAdmin(user.roles))) {
      return from.path
    }
  })
}

const routes: RouteRecordRaw[] = [
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
        name: 'SettingsPage',
        component: () => import('@/pages/account/SettingsPage.vue'),
        beforeEnter: checkAuth
      },
      {
        path: '/myResponses',
        name: 'MyResponses',
        component: () => import('@/pages/account/MyResponsesPage.vue'),
        beforeEnter: checkAuth
      },
      {
        path: '/myAchievements',
        name: 'MyAchievements',
        component: () => import('@/pages/account/MyAchievementsPage.vue'),
        beforeEnter: checkAuth
      },
      {
        path: '/create',
        name: 'Create',
        component: () => import('@/pages/CreatingPage.vue'),
        beforeEnter: checkAuth
      },
      {
        path: '/edit/:id',
        name: 'Editing',
        props: true,
        component: () => import('@/pages/EditingPage.vue')
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/pages/AboutProjectPage.vue')
      },
      {
        path: '/admin',
        name: 'Admin',
        component: () => import('@/pages/admin/AdminPage.vue'),
        beforeEnter: checkAdmin
      },
      {
        path: '/admin/school/:id',
        name: 'SchoolPage',
        component: () => import('@/pages/admin/SchoolPage.vue'),
        beforeEnter: checkAdmin,
        props: true
      },
      {
        path: '/admin/moderation',
        name: 'Moderation',
        component: () => import('@/pages/admin/ModerationPage.vue'),
        beforeEnter: checkAdmin
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
  history: createWebHistory(),
  routes
})

export default router
