<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../components/BackButton.vue'
import { useAuth } from '../stores/auth'
import { useField, useForm, FieldContext } from 'vee-validate'
import Town from '../types/town.interface'
import School from '../types/school.interface'
import { useSchool } from '../stores/school'
import { useTown } from '../stores/town'
import _ from 'lodash'
import { storeToRefs } from 'pinia'

document.title = 'Регистрация — Ищу наставника'

let router = useRouter()
let auth = useAuth()

let { user } = storeToRefs(auth)

let schoolStore = useSchool()
let { towns } = useTown()

function grades() {
  let result = [{ digit: '—', number: 0 }]
  
  for (let i = 1; i <= 11; i++) result.push({ digit: i.toString(), number: i })

  return result
}

const { meta, handleSubmit, handleReset, validate } = useForm<{
  name: string,
  email: string,
  password: string,
  town?: Town,
  school: School | null,
  grade: number
}>({
  initialValues: {
    name: '',
    email: '',
    password: '',
    school: null,
    grade: 0,
  },
  validationSchema: {
    name(value: string) {
      if (value.length === 0) return 'введите фамилию, имя'
      if (value.length < 4) return 'слишком короткое имя и фамилия'
      if (value.length > 22) return 'слишком длинное имя и фамилия'

      return true
    },
    email(value: string) {
      if (value.length === 0) return 'введите почту'
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value))
        return 'неправильно ведено'

      return true
    },
    password(value: string) {
      if (value.length === 0) return 'введите пароль'
      if (value.length < 8) return 'минимум 8 символов'
      if (value.length > 30) return 'слишком длинный пароль'

      return true
    },
    town(value: Town | null) {
      if (!value) return 'укажите свой город'
      return true
    },
    school(value: School | null) {
      if (!value) return 'укажите свою школу'
      return true
    },
    grade(value: number) {
      return true
    },
  },
})

let name: FieldContext<string> = useField('name')
let email: FieldContext<string> = useField('email')
let password: FieldContext<string> = useField('password')
let town: FieldContext<Town | null> = useField('town')
let school: FieldContext<School | null> = useField('school')
let grade: FieldContext<number> = useField('grade')
let mentor = ref(false)

let show_password = ref(false)

let schools_in_town = ref(town.value.value ? await schoolStore.get_all_in_town(town.value.value._id) : [])

watch(town.value, async (new_value, old_value) => {
  if (_.isEqual(new_value, old_value)) return

  school.value.value = null
  schools_in_town.value = town.value.value ? await schoolStore.get_all_in_town(town.value.value._id) : []
})

let loading = ref(false)

const submit = handleSubmit(async values => {
  loading.value = true
  
  delete values.town

  await auth.registration(Object.assign(values, {
    roles: ['student', mentor.value ? 'mentor' : null],
  }))
  .then(() => { 
    if (user.value) router.push(`/user/${user.value._id}`)
  })

  loading.value = false 
})
</script>

<template>
  <v-container>
    <BackButton />

    <v-col 
      cols="12" xs="12" sm="10" md="7" lg="5" 
      class="mt-4 ma-auto"
    >
      <v-card 
        class="d-flex flex-column 
        justify-center align-center 
        text-center w-100 pl-6 pr-6 
        pt-4 pb-6 rounded-lg"
      >
        <div 
          class="text-h6 font-weight-bold"
        >
          Регистрация
        </div>
  
        <v-form
          class="mt-6 w-100"
          @submit="submit"
        >
          <v-text-field 
            label="Имя Фамилия"
            type="name"
            placeholder="Иван Иванов"
            v-model="name.value.value"
            :error-messages="name.errors.value"
            variant="outlined"
            density="compact"
            class="w-100"
          />    

          <v-text-field 
            label="Email"
            type="email"
            placeholder="vasya@ya.ru"
            v-model="email.value.value"
            :error-messages="email.errors.value"
            variant="outlined"
            density="compact"
            class="w-100 mt-1"
          />          

          <v-text-field 
            label="Пароль"
            v-model="password.value.value"
            :append-inner-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show_password = !show_password"
            :type="show_password ? 'text' : 'password'"
            :error-messages="password.errorMessage.value"
            variant="outlined"
            density="compact"
            class="w-100 mt-1"
          />

          <v-autocomplete
            label="Город"
            v-model="town.value.value"
            :error-messages="town.errors.value"
            :items="towns"
            auto-select-first
            return-object
            item-title="name"
            variant="outlined"
            density="compact"
            class="w-100 mt-1"
          />

          <v-autocomplete
            label="Школа"
            v-model="school.value.value"
            :disabled="!town.value.value"
            :error-messages="school.errors.value"
            :items="schools_in_town"
            auto-select-first
            item-title="name"
            return-object
            variant="outlined"
            density="compact"
            class="w-100 mt-1"
          />

          <v-select
            label="Класс"
            v-model="grade.value.value"
            :error-messages="grade.errors.value"
            :items="grades()"
            auto-select-first
            item-title="digit"
            item-value="number"
            variant="outlined"
            density="compact"
            class="w-100 mt-1"
          />

          <v-radio-group
            v-model="mentor"
            label="Кто вы?"
            hide-details
            class="mt-2"
            column
          >
            <v-radio
              label="Наставляемый"
              :value="false"
            />
            
            <v-radio
              label="Наставник"
              :value="true"
            />
          </v-radio-group>

          <v-btn 
            type="submit" 
            :disabled="!meta.valid" 
            :loading="loading"
            color="accent"
            class="mt-6"
          >
            Зарегистрироваться
          </v-btn>
        </v-form>
  
        <div 
          @click="router.push('/login')" 
          class="text-subtitle-1 w-100 cursor-pointer font-weight-semibold pa-1 mt-2"
        >
          вход
        </div>
      </v-card>
    </v-col>
  </v-container>
</template>
