<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/Header.vue'

let router = useRouter()

let navigation_drawer_is_open = ref(false)
let nav_buttons = [
  {
    route: '/',
    title: 'Главная',
    group: false
  },
  {
    title: 'Поиск',
    group: true,
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
    route: '/account',
    title: 'Мой профиль',
    group: false
  },
  {
    route: '/myResponses',
    title: 'Мои отклики',
    group: false
  },
  {
    route: '/myAchievements',
    title: 'Мои награды',
    group: false
  },
  {
    route: '/about',
    title: 'О проекте',
    group: false
  },
]
</script>

<template>
  <v-app>
    <!-- Header -->
    <v-app-bar :elevation="0" density="compact" color="primary">
      <v-container class="d-flex align-center header-container justify-space-between">
        <v-icon 
          class="pt-5 pr-5 pb-5 pl-4"
          icon="mdi-menu"
          @click="navigation_drawer_is_open = !navigation_drawer_is_open"
        />

        <div class="header-title text-h6 font-weight-bold text-no-wrap">Ищу наставника</div>

        <v-avatar class="cursor-pointer" size="30" color="#FFFFFF" />
      </v-container>
    </v-app-bar>

    <!-- Navigation (menu) -->
    <v-navigation-drawer
      location="left"
      color="primary"
      temporary
      v-model="navigation_drawer_is_open"
    >
      <v-list class="d-flex flex-column justify-space-between h-100">
        <div class="w-100">
          <template
            v-for="button in nav_buttons"
            :key="button.title"
          >
            <!-- Usually -->
            <v-list-item
              v-if="!button.group"
              @click="router.push(button.route);
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
        </div>

        <v-list-item 
          style="font-weight: 600;"
          to="/termsOfUse"
        >Пользовательское соглашение</v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Content -->
    <v-main>
      <router-view></router-view>
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
