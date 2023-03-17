// Composables
import { createRouter, createWebHistory } from 'vue-router'

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
        path: '/searchGroups',
        name: 'GroupsSearching',
        component: () => import('@/pages/searching/GroupsSearchPage.vue')
      },
      {
        path: '/account',
        name: 'Account',
        component: () => import('@/pages/account/AccountPage.vue')
      },
      {
        path: '/settings',
        name: 'AccountSettingsPage',
        component: () => import('@/pages/account/AccountSettingsPage.vue')
      },
      {
        path: '/myResponses',
        name: 'MyResponses',
        component: () => import('@/pages/account/MyResponsesPage.vue')
      },
      {
        path: '/myAchievements',
        name: 'MyAchievements',
        component: () => import('@/pages/account/MyAchievementsPage.vue')
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/pages/AboutProjectPage.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
