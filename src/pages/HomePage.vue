<script setup lang="ts">
import { useRouter } from "vue-router"
import RolesService from "../services/RolesService"
import { useAuth } from '../stores/auth'
 
document.title = 'Ищу наставника'

let router = useRouter()

let user = auth.getUser()
let auth = useAuth()

let buttons = user ? [
  {
    route: '/searchMentors',
    text: 'Найти наставника',
  },  
  {
    route: '/create',
    text: 'Создать',
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

function getType(): string {
  if (!user)
    return 'войдите или зарегистрируйтесь'

  let ranks = user.ranks && user.ranks.length > 0 ? ', '+user.ranks.join(', ') : ''

  if (RolesService.isSomeAdmin(user.roles))
    return `админ${ranks}`

  if (RolesService.isMentor(user.roles))
    return `наставник${ranks}`

  return `наставляемый${ranks}`
}
</script>

<template>
  <v-container>
    <v-row class="align-start align-md-center ma-0 pa-0 mt-6 flex-nowrap">
      <v-avatar :image="user?.avatar_url" size="60" color="blue" />
      <div class="d-flex ml-4 flex-column justify-start">
        <div class="font-weight-bold text-h5">{{ user ? `Привет, ${user.name}` : 'Вы не представились'}}</div>
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
          style="line-height: 1.4;"
          color="primary"
          class="d-flex rounded-lg pl-8 pr-8 justify-center text-center font-weight-bold text-h6 align-center"
          height="140"
        >
          {{ button.text }}
        </v-card>
      </v-col>
    </v-row>

    <v-row 
      class="ma-auto mt-14 justify-center align-center flex-wrap"
    >
      <v-col 
        cols="6" sm="5" md="4" lg="2"
      >
        <v-img src="@/assets/images/2023.png" />
      </v-col>
      
      <v-col 
        cols="6" sm="5" md="4" lg="2"
      >
        <v-img src="@/assets/images/rosmol.png" />
      </v-col>
    </v-row>
  </v-container>
</template>
