<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AchievementsService from '../services/AchievementsService';
import RolesService from '../services/RolesService';
import { useAuth } from '../stores/auth';
import { User } from '../types/user.interface';

let router = useRouter()

let auth = useAuth()
await auth.checkAuth()

let isAuth = auth.getAuthStatus()
let user = auth.getUser()

let navigation_drawer_is_open = ref(false)
let nav_buttons = [
  {
    route: '/',
    title: 'Главная',
    group: false,
    condition: true
  },
  {
    title: 'Поиск',
    group: true,
    condition: true,
    routes: [
      {
        route: '/searchMentors',
        title: 'Наставники',
      },
      {
        route: '/serchLessons',
        title: 'Уроки',
      },
      {
        route: '/searchClubs',
        title: 'Клубы'
      }
    ]
  },
  {
    route: '/create',
    title: 'Создать',
    group: false,
    condition: isAuth
  },
  {
    route: '/admin',
    title: 'Управление',
    group: false,
    condition: user && RolesService.isSomeAdmin(user.roles)
  },
  {
    route: `/user/${user?._id}`,
    title: 'Мой профиль',
    group: false,
    condition: isAuth
  },
  {
    route: '/myResponses',
    title: 'Мои отклики',
    group: false,
    condition: isAuth
  },
  {
    route: '/myAchievements',
    title: `Мои награды (${user ? AchievementsService.getActiveAchievements(user.achievements).length : 0})`,
    group: false,
    condition: isAuth
  },
  {
    route: '/about',
    title: 'О проекте',
    group: false,
    condition: true
  },
  {
    route: '/termsOfUse',
    title: 'Пользовательское соглашение',
    group: false,
    condition: true
  },
]
</script>

<template>
  <v-app>
    <!-- Header -->
    <v-app-bar 
      :elevation="0" 
      density="compact" 
      color="primary"
      style="padding-left: calc(100vw - 100%);"
    >
      <v-container 
        class="d-flex align-center header-container justify-space-between"
      >
        <v-icon 
          class="pt-5 pr-5 pb-5 pl-4"
          icon="mdi-menu"
          @click="navigation_drawer_is_open = !navigation_drawer_is_open"
        />

        <router-link 
          style="text-decoration: none;color: #FFFFFF;" 
          to="/" 
          class="header-title text-h6 font-weight-bold text-no-wrap"
        >
          Ищу наставника
        </router-link>

        <v-avatar 
          class="cursor-pointer" 
          size="30" 
          color="#FFFFFF" 
          :image="user?.avatar_url"
          @click="isAuth ? router.push(`/user/${user?._id}`) : router.push('/login')"
        />
      </v-container>
    </v-app-bar>

    <!-- Navigation (menu) -->
    <v-navigation-drawer
      location="left"
      color="primary"
      temporary
      v-model="navigation_drawer_is_open"
    >
      <v-list class="d-flex flex-column justify-space-between">
        <template
          v-for="button in nav_buttons"
          :key="button.title"
        >
          <!-- Usually -->
          <v-list-item
            v-if="!button.group && button.condition"
            @click="router.push(button.route as string);
              navigation_drawer_is_open = !navigation_drawer_is_open"
            style="font-weight: 600;"
          >
            {{ button.title }}
          </v-list-item>

          <!-- If group -->
          <v-list-group
            v-if="button.group"
            :value="button.title"
          >
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :key="button.title"
                style="font-weight: 600;"
              >
                {{ button.title }}
              </v-list-item>
            </template>
            
            <v-list-item
              v-for="btn in button.routes"
              :key="btn.title"
              @click="router.push(btn.route);
                navigation_drawer_is_open = !navigation_drawer_is_open"
              style="font-weight: 600;"
            >
              {{ btn.title }}
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- Content -->
    <v-main style="padding-bottom: 80px;">
      <Suspense>
        <router-view></router-view>
      </Suspense>
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
.header-container {
  position: relative;
}
.header-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
