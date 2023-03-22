<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../components/BackButton.vue'

document.title = 'Авторизация — Ищу наставника'

let router = useRouter()

let email = ref('')
let password = ref('')
let agree = ref(true)

let form = ref(false)
let passkeys_support = ref(false)

function submit() {

}
</script>

<template>
  <v-container class="align-start">
    <BackButton></BackButton>

    <v-col cols="12" xs="12" md="6" lg="5" class="mt-4 ma-auto">
      <v-card 
        class="d-flex flex-column justify-center align-center text-center 
               w-100 pl-6 pr-6 pt-4 pb-6"
      >
        <div class="text-h6 font-weight-bold">Вход</div>
  
        <v-form
          v-model="form"
          @submit="submit"
          class="mt-4 w-100"
        >
          <v-text-field 
            label="Email"
            placeholder="vasya@ya.ru"

            v-model="email"
            variant="underlined"
            hide-details
            class="w-100"
          />
          <v-text-field 
            label="Пароль"
            v-model="password"
            variant="underlined"
            hide-details
            class="mt-2 w-100"
          />

          <v-checkbox v-model="agree" class="w-100 ma-0 pa-0">
            <template v-slot:label>
              <div>
                Принимаю <router-link to="/registration">пользовательское соглашение</router-link>
              </div>
            </template>
          </v-checkbox>
        </v-form>
  
        <v-btn color="accent" class="mt-6">войти</v-btn>
  
        <div 
          @click="router.push('/registration')" 
          class="text-body-2 w-100 cursor-pointer font-weight-semibold pa-1 mt-4"
        >регистрация</div>
        <div
          class="text-body-2 w-100 cursor-pointer font-weight-semibold pa-1"
        >восстановить пароль</div>
      </v-card>
    </v-col>
  </v-container>
</template>