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
  },
  {
    route: '/searchMentors',
    title: 'Поиск наставников',
  },
  {
    route: '/serchLessons',
    title: 'Поиск уроков',
  },
	{
		route: '/searchGroups',
		title: 'Поиск кружков'
	},
  {
    route: '/account',
    title: 'Мой профиль',
  },
  {
    route: '/myResponses',
    title: 'Мои отклики',
  },
]
</script>

<template>
  <v-app>
    <!-- Header -->
    <v-app-bar :elevation="0" density="compact" color="primary">
      <v-container class="d-flex align-center header-container justify-space-between">
        <v-icon 
          class="pa-5"
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
      <v-list>
        <v-list-item
          v-for="button in nav_buttons"
          :key="button.title"
          @click="router.push(button.route)"
          style="font-weight: 600;"
        >
          {{ button.title }}
        </v-list-item>
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