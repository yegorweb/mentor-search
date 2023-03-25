<script setup lang="ts">
import { useRouter } from "vue-router"
import { useAuth } from '../stores/auth'
 
document.title = 'Ищу наставника'

let auth = useAuth()
let user = auth.getUser()

let isAuth = auth.getAuthStatus()

let buttons = isAuth ? [
  {
    route: '/searchMentors',
    text: 'Найти наставника',
  },  
  {
    route: '/settings',
    text: 'Стать наставником',
  },  
  {
    route: '/myResponses',
    text: 'Мои отклики',
  },
] : [
  {
    route: '/login',
    text: 'Авторизоваться',
  },
  {
    route: '/searchMentors',
    text: 'Посмотреть наставников',
  },  
]

let router = useRouter()

function getType(): string {
  if (user?.roles.includes('school-admin') || user?.roles.includes('global-admin')) {
    return 'админ'
  }
  if (user?.roles.includes('mentor')) {
    return 'наставник'
  }
  if (!isAuth) {
    return 'войдите или зарегистрируйтесь'
  }

  return 'наставляемый'
}
</script>

<template>
  <v-container>
    <v-row class="align-center ma-0 pa-0 mt-5 flex-nowrap">
      <v-avatar :url="user?.avatar_url" size="60" color="blue" />
      <div class="d-flex ml-4 flex-column justify-start">
        <div class="font-weight-bold text-h5">{{ auth.getAuthStatus() ? `Привет, ${user?.name}` : 'Вы не представились'}}</div>
        <div class="text-body-3 text-text_gray">{{ getType() }}</div>
      </div>
    </v-row>

    <v-row class="mt-10">
      <v-col 
        v-for="button in buttons" 
        :key="button.text" 
        cols="12" md="4" sm="6" xs="12"
      >
        <v-card 
          @click="router.push(button.route)" 
          color="primary"
          class="d-flex pl-8 pr-8 justify-center text-center font-weight-bold text-h6 align-center"
          height="140"
        >
          {{ button.text }}
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>

</style>