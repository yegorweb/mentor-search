<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../components/BackButton.vue'
import { useAuth } from '../stores/auth'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

document.title = 'Авторизация — Ищу наставника'

let router = useRouter()

let formState = reactive({
  email: '',
  password: '',
})

async function submit() {
  let auth = useAuth()

  let status = await auth.login(formState.email, formState.password)

  if (status?.success) {
    if (localStorage.getItem('requestedLink')) {
      window.location.href = localStorage.getItem('requestedLink')
    } else {
      window.location.href = '/'
    }
  }
}

const formSchema = yup.object({
  email: yup.string().required('заполните поле').email('неверный формат'),
  password: yup.string().required('заполните поле').min(6, 'минимум 6 символов'),
})
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
  
        <Form
          class="mt-4 w-100"
          :validation-schema="formSchema"
          v-slot="{ meta }"
          @submit="submit"
        >
          <Field name="email" v-slot="{ value, handleChange }">
            <v-text-field 
              label="Email"
              type="email"
              placeholder="vasya@ya.ru"
              v-model="formState.email"
              @update:model-value="handleChange"
              variant="underlined"
              class="w-100 mb-1"
              hide-details
            />          
          </Field>
          <Transition name="fade">
            <ErrorMessage name="email" class="error-message" />
          </Transition>

          <Field name="password" v-slot="{ value, handleChange }">
            <v-text-field 
              label="Пароль"
              type="password"
              v-model="formState.password"
              @update:model-value="handleChange"
              variant="underlined"
              class="w-100 mb-1 mt-2"
              hide-details
            />
          </Field>
          <Transition name="fade">
            <ErrorMessage name="password" class="error-message" />
          </Transition>

          <v-btn type="submit" :disabled="!meta.valid" color="accent" class="mt-6">Войти</v-btn>
        </Form>
  
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