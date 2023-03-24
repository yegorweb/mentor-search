<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../components/BackButton.vue'
import TownService from '../services/TownService'
import SchoolService from '../services/SchoolService'
import { useAuth } from '../stores/auth'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

document.title = 'Регистрация — Ищу наставника'

let router = useRouter()

let questions = [
  {
    question: 'Я учусь:',
    answers: ['Отлично, все пятёрки', 'Хорошо', 'Нормально', 'Плохо']
  },
  {
    question: 'Трудности?',
    answers: ['Нет', 'Да']
  },
  {
    question: 'Почему я?',
    answer: ''
  }
]

let formState = reactive({
  name: '',
  email: '',
  password: '',
  town: {
    name: '',
    _id: ''
  },
  school: {
    name: '',
    _id: ''
  },
  grade: 0,
  roles: ['student'],
  agree: false,
  mentor: false,
  answers: [{
    question: 'Я учусь:',
    answer: ''
  },
  {
    question: 'Трудности?',
    answer: ''
  },
  {
    question: 'Почему я?',
    answer: ''
  }]
})

let towns = (await TownService.getTowns()).data

let schools = (await SchoolService.get_all()).data

function schools_in_town() {
  return schools.filter(sch => sch.town_id === formState.town._id)
}

console.log(schools)

function grades() {
  let result = [{ digit: '—', number: 0 }]

  for (let i = 1; i <= 11; i++) result.push({ digit: i.toString(), number: i })

  return result
}

async function submit() {
  let auth = useAuth()

  let status = await auth.registration({ 
    name: formState.name, 
    email: formState.email, 
    password: formState.password, 
    grade: formState.grade, 
    town_id: formState.town._id,
    school_id: formState.school._id,
    roles: formState.mentor ? ['student', 'mentor'] : ['student'],
    answers: formState.mentor ? formState.answers : {}
  })

  if (status?.success) router.push('/')
}

const formSchema = yup.object({
  name: yup.string().required('заполните поле').min(4, 'слишком короткое имя и фамилия'),
  email: yup.string().required('заполните поле').email('неверный формат'),
  password: yup.string().required('заполните поле').min(6, 'минимум 6 символов'),
  town: yup.object().required('заполните поле'),
  school: yup.object().required('заполните поле'),
  grade: yup.number().required('заполните поле'),
  agree: yup.boolean().required('нужно ваше согласие'),
})
</script>

<template>
  <v-container>
    <BackButton />

    <v-col cols="12" xs="12" sm="10" md="7" lg="5" class="mt-4 ma-auto">
      <v-card class="d-flex flex-column justify-center align-center text-center w-100 pl-6 pr-6 pt-4 pb-6">
        <div class="text-h6 font-weight-bold">Регистрация</div>
  
        <Form
          class="mt-4 w-100"
          :validation-schema="formSchema"
          v-slot="{ meta }"
          @submit="submit"
        >
          <Field name="name" v-slot="{ value, handleChange }">
            <v-text-field 
              label="Имя Фамилия"
              type="name"
              placeholder="Иван Иванов"
              @update:model-value="handleChange"
              v-model="formState.name"
              variant="underlined"
              class="w-100 mb-1"
              hide-details
            />    
          </Field>
          <Transition name="fade">
            <ErrorMessage name="name" class="error-message" />
          </Transition>

          <Field name="email" v-slot="{ value, handleChange }">
            <v-text-field 
              label="Email"
              type="email"
              placeholder="vasya@ya.ru"
              v-model="formState.email"
              @update:model-value="handleChange"
              variant="underlined"
              class="w-100 mb-1 mt-2"
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

          <Field name="town" v-slot="{ value, handleChange }">
            <v-select
              label="Город"
              v-model="formState.town"
              @update:model-value="handleChange"
              :items="towns"
              item-title="name"
              return-object
              variant="underlined"
              class="w-100 mb-1 mt-8"
              hide-details
            ></v-select>
          </Field>
          <Transition name="fade">
            <ErrorMessage name="town" class="error-message" />
          </Transition>

          <Field name="school" v-slot="{ value, handleChange }">
            <v-select
              label="Школа"
              :disabled="formState.town._id.length==0"
              v-model="formState.school"
              @update:model-value="handleChange"
              :items="schools_in_town()"
              item-title="name"
              return-object
              variant="underlined"
              class="w-100 mb-1 mt-8"
              hide-details
            ></v-select>
          </Field>
          <Transition name="fade">
            <ErrorMessage name="school" class="error-message" />
          </Transition>

          <Field name="grade" v-slot="{ value, handleChange }">
            <v-select
              label="Класс"
              v-model="formState.grade"
              @update:model-value="handleChange"
              :items="grades()"
              item-title="digit"
              item-value="number"
              variant="underlined"
              class="w-100 mb-1 mt-6"
              hide-details
            ></v-select>
          </Field>
          <Transition name="fade">
            <ErrorMessage name="grade" class="error-message" />
          </Transition>

          <v-radio-group
            v-model="formState.mentor"
            label="Кто вы?"
            hide-details
            class="mt-8"
            column
          >
            <v-radio
              label="Наставляемый"
              :value="false"
            ></v-radio>
            <v-radio
              label="Наставник"
              :value="true"
            ></v-radio>
          </v-radio-group>
          
          <div v-if="formState.mentor" style="gap: 6px;" class="w-100 mt-6 d-flex flex-column flex-nowrap align-start">
            <div class="d-flex flex-column flex-nowrap align-start mb-2">
              <div class="text-body-1 font-weight-semibold">Ответьте на несколько вопросов</div>
              <div class="text-caption text-gray">Это не повлияет на использование</div>
            </div>

            <template
              v-for="(item, index) in questions"
              :key="index"
            >
              <v-radio-group
                v-if="typeof item.answers !== 'undefined'"
                v-model="formState.answers[index].answer"
                :label="item.question"
                hide-details
                column
              >
                <v-radio
                  v-for="answer_item in item.answers"
                  :key="answer_item"
                  :label="answer_item"
                  :value="answer_item"
                />
              </v-radio-group>

              <v-text-field 
                v-if="typeof item.answer !== 'undefined'"
                :label="item.question"
                v-model="formState.answers[index].answer"
                variant="solo"
                class="w-100"
                hide-details
              />    
            </template>
          </div>

          <Field name="agree" v-slot="{ value, handleChange }">
            <v-checkbox 
              v-model="formState.agree"
              @change="handleChange"
              class="w-100 mt-4 ma-0 pa-0 align-start"
            >  
              <template v-slot:label>
                <div class="text-start">
                  Принимаю <router-link to="/registration">пользовательское соглашение</router-link>
                </div>  
              </template>  
            </v-checkbox>  
          </Field>  
          <Transition name="fade">
            <ErrorMessage name="agree" class="error-message" />
          </Transition>  

          <v-btn type="submit" :disabled="!meta.valid" color="accent" class="mt-6">Отправить</v-btn>
        </Form>
  
        <div 
          @click="router.push('/login')" 
          class="text-subtitle-1 w-100 cursor-pointer font-weight-semibold pa-1 mt-2"
        >вход</div>
      </v-card>
    </v-col>
  </v-container>
</template>