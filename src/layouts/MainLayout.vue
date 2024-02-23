<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AchievementsService from '../services/AchievementsService';
import RolesService from '../services/RolesService';
import { useAuth } from '../stores/auth';
import { useSchool } from '../stores/school';
import { useTown } from '../stores/town';
import { User } from '../types/user.interface';

let router = useRouter()

let auth = useAuth()
await auth.checkAuth()

let { user } = storeToRefs(auth)

if (user.value && RolesService.isSomeAdmin(user.value.roles)) {
  useTown().fetchAdministeredTowns()
  useSchool().fetchAdministeredSchools()
}

let navigation_drawer_is_open = ref(false)
</script>

<template>
  <v-app>
    <!-- Header -->
    <v-app-bar 
      :elevation="0" 
      density="compact" 
      color="primary"
      style="padding-left: calc(100vw - 100%); z-index: 3000;"
    >
      <v-container 
        class="d-flex align-center header-container justify-space-between"
      >
        <div 
          @click="navigation_drawer_is_open = !navigation_drawer_is_open"
          class="cursor-pointer"
          style="margin: -6px; padding: 6px;"
        >
          <v-icon>
            mdi-menu
          </v-icon>
        </div>

        <div 
          class="header-title cursor-pointer text-white text-h6 font-weight-bold text-no-wrap"
          style="user-select: none;"
          @click="router.push('/')" 
        >
          Ищу наставника
        </div>

        <v-avatar 
          @click="router.push(user ? `/user/${user._id}` : '/login')"
          :image="user ? user.avatar_url ?? '' : ''"
          class="cursor-pointer" 
          size="30" 
          color="#FFFFFF" 
        />
      </v-container>
    </v-app-bar>

    <!-- Navigation (menu) -->
    <v-navigation-drawer
      v-model="navigation_drawer_is_open"
      location="left"
      color="primary"
      temporary
    >
      <v-list class="d-flex flex-column justify-space-between">

        <v-list-item
          @click="navigation_drawer_is_open = !navigation_drawer_is_open"
          exact
          to="/"
          class="font-weight-semibold"
        >
          Главная
        </v-list-item>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              class="font-weight-semibold"
            >
              Поиск
            </v-list-item>
          </template>
          
          <v-list-item
            @click="navigation_drawer_is_open = !navigation_drawer_is_open"
            class="font-weight-semibold"
            exact
            to="/search-mentors"
          >
            Наставники
          </v-list-item>
          
          <v-list-item
            @click="navigation_drawer_is_open = !navigation_drawer_is_open"
            class="font-weight-semibold"
            exact
            to="/search-lessons"
          >
            Уроки
          </v-list-item>
          
          <v-list-item
            @click="navigation_drawer_is_open = !navigation_drawer_is_open"
            class="font-weight-semibold"
            exact
            to="/search-clubs"
          >
            Клубы
          </v-list-item>
        </v-list-group>

        <v-list-item
          v-if="!user"
          @click="navigation_drawer_is_open = !navigation_drawer_is_open"
          exact
          to="/login"
          class="font-weight-semibold"
        >
          Авторизация
        </v-list-item>
        
        <v-list-item
          v-if="user"
          @click="navigation_drawer_is_open = !navigation_drawer_is_open"
          exact
          to="/create"
          class="font-weight-semibold"
        >
          Создать
        </v-list-item>

        <v-list-item
          v-if="user && RolesService.isSomeAdmin(user.roles)"
          @click="navigation_drawer_is_open = !navigation_drawer_is_open"
          to="/admin"
          class="font-weight-semibold"
        >
          Управление
        </v-list-item>

        <v-list-item
          v-if="user"
          @click="navigation_drawer_is_open = !navigation_drawer_is_open"
          exact
          :to="`/user/${(user as User)._id}`"
          class="font-weight-semibold"
        >
          Моя страница
        </v-list-item>
        
        <v-list-item
          v-if="user"
          @click="navigation_drawer_is_open = !navigation_drawer_is_open"
          exact
          to="/my-responses"
          class="font-weight-semibold"
        >
          Мои отклики
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Content -->
    <v-main style="padding-bottom: 80px;">
      <Suspense>
        <router-view :key="$route.path"></router-view>
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
