<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../components/BackButton.vue'
import TownService from '../services/TownService'
import SchoolService from '../services/SchoolService'

document.title = 'Регистрация — Ищу наставника'

let router = useRouter()

let name = ref('')
let email = ref('')
let password = ref('')
let grade = ref(0)
let town_id = ref('')
let school_id = ref('')
let agree = ref(true)

let form = ref(false)
let passkeys_support = ref(false)

let towns = await TownService.getTowns()
let selected_town_id = ref('')

async function schools_in_town() {
  return await SchoolService.get_all_in_town(selected_town_id.value)
}

function submit() {

}
</script>

<template>
  <Suspense>
  <v-container>
    <BackButton />

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
            label="Имя Фамилия"
            placeholder="Иван Иванов"
            v-model="name"
            variant="underlined"
            hide-details
            class="w-100"
          />
          <v-text-field 
            label="Email"
            placeholder="vasya@ya.ru"
            v-model="email"
            variant="underlined"
            hide-details
            class="mt-2 w-100"
          />
          <v-text-field 
            label="Пароль"
            v-model="password"
            variant="underlined"
            hide-details
            class="mt-2 w-100"
          />
          <v-select
            label="Город"
            v-model="selected_town_id"
            :items="towns"
            item-title="name"
            item-value="id"
            variant="solo"
            hide-details
          ></v-select>
          <v-select
            label="Школа"
            v-model="school_id"
            :items="schools_in_town()"
            item-title="name"
            item-value="id"
            variant="solo"
            hide-details
          ></v-select>
          
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
          @click="router.push('/login')" 
          class="text-body-2 w-100 cursor-pointer font-weight-semibold pa-1 mt-4"
        >вход</div>
      </v-card>
    </v-col>
  </v-container>
  </Suspense>
</template>