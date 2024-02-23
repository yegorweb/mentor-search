<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router"
import RolesService from "../services/RolesService"
import { useAuth } from '../stores/auth'
 
document.title = 'Ищу наставника'

let router = useRouter()

let auth = useAuth()
let { user } = storeToRefs(auth)

let buttons = user.value ? [
  {
    route: '/search-mentors',
    text: 'Найти наставника',
  },  
  {
    route: '/create',
    text: 'Создать',
  },  
  {
    route: '/my-responses',
    text: 'Мои отклики',
  },
] : [
  {
    route: '/login',
    text: 'Авторизоваться',
  },
  {
    route: '/search-mentors',
    text: 'Посмотреть наставников',
  },  
]

function getType(): string {
  if (!user.value)
    return 'войдите или зарегистрируйтесь'

  let ranks = user.value.ranks && user.value.ranks.length > 0 ? ', '+user.value.ranks.join(', ') : ''

  if (RolesService.isSomeAdmin(user.value.roles))
    return `админ${ranks}`

  if (RolesService.isMentor(user.value.roles))
    return `наставник${ranks}`

  return `наставляемый${ranks}`
}
</script>

<template>
  <v-container>
    <v-row class="align-start align-md-center ma-0 pa-0 mt-6 flex-nowrap">
      <v-avatar :image="user ? user.avatar_url ?? '' : ''" size="60" color="blue" />
      <div class="d-flex ml-4 flex-column justify-start">
        <div class="font-weight-bold text-h5" style="line-height: 1.225;">{{ user ? `Привет, ${user.name}` : 'Вы не представились'}}</div>
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

    <v-row class="justify-center mt-8">
      <v-col cols="auto" class="pt-0 pb-0">
        <v-btn 
          variant="text"
          to="/about"
          prepend-icon="mdi-information"
          color="grey-darken-1" 
        >
          О проекте
        </v-btn>
      </v-col>

      <v-col cols="auto" class="pt-0 pb-0">
        <v-btn 
          variant="text"
          href="https://vk.com/yegorwebdev"
          target="_blank"
          prepend-icon="mdi-chat-alert"
          color="grey-darken-1" 
        >
          Обратная связь
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
