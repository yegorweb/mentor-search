<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../components/BackButton.vue'
import { useAuth } from '../stores/auth'
import { useField, useForm, FieldContext } from 'vee-validate'
import Town from '../types/town.interface'
import School from '../types/school.interface'
import { useSchool } from '../stores/school'
import { useTown } from '../stores/town'

document.title = 'Регистрация — Ищу наставника'

let router = useRouter()
let auth = useAuth()

let schoolStore = useSchool()
let townStore = useTown()

let towns: Town[] = await townStore.get_all() as any
let schools: School[] = await schoolStore.get_all() as any

function schools_in_town(): School[] {
  return schools.filter(sch => sch.town._id === town.value.value?._id)
}

function grades() {
  let result = [{ digit: '—', number: 0 }]
  
  for (let i = 1; i <= 11; i++) result.push({ digit: i.toString(), number: i })

  return result
}

const { meta, handleSubmit, handleReset, validate } = useForm({
  initialValues: {
    name: '',
    email: '',
    password: '',
    town: null,
    school: null,
    grade: 0,
    agree: true
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
      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value))
        return 'неправильно ведено'

      return true
    },
    password(value: string) {
      if (value.length === 0) return 'введите пароль'
      if (value.length < 8) return 'минимум 8 символов'
      if (value.length > 30) return 'слишком длинный пароль'

      return true
    },
    town(value: Town) {
      if (!value) return 'укажите свой город'
      return true
    },
    school(value: School) {
      if (!value) return 'укажите свою школу'
      return true
    },
    grade(value: number) {
      return true
    },
    agree(value: boolean) {
      if (!value) return 'нужно ваше соглашение'
      return true
    },
  },
})

let name: FieldContext<string> = useField('name')
let email: FieldContext<string> = useField('email')
let password: FieldContext<string> = useField('password')
let town: FieldContext<Town> = useField('town')
let school: FieldContext<School> = useField('school')
let grade: FieldContext<number> = useField('grade')
let agree: FieldContext<boolean> = useField('agree')
let mentor = ref(false)

let loading = ref(false)

const submit = handleSubmit(async values => {
  loading.value = true
  
  await auth.registration(Object.assign(values, {
    roles: ['student', mentor.value ? 'mentor' : null],
  }))

  loading.value = false 
  window.location.href = auth.user ? `/user/${auth.user._id}` : '/'
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
          class="mt-4 w-100"
          @submit="submit"
        >
          <v-text-field 
            label="Имя Фамилия"
            type="name"
            placeholder="Иван Иванов"
            v-model="name.value.value"
            :error-messages="name.errors.value"
            variant="underlined"
            class="w-100 mb-1"
          />    

          <v-text-field 
            label="Email"
            type="email"
            placeholder="vasya@ya.ru"
            v-model="email.value.value"
            :error-messages="email.errors.value"
            variant="underlined"
            class="w-100 mb-1 mt-2"
          />          

          <v-text-field 
            label="Пароль"
            type="password"
            v-model="password.value.value"
            :error-messages="password.errors.value"
            variant="underlined"
            class="w-100 mb-1 mt-2"
          />

          <v-select
            label="Город"
            v-model="town.value.value"
            :error-messages="town.errors.value"
            :items="towns"
            return-object
            item-title="name"
            variant="underlined"
            class="w-100 mb-1 mt-8"
          ></v-select>

          <v-select
            label="Школа"
            v-model="school.value.value"
            :disabled="!town.value.value"
            :error-messages="school.errors.value"
            :items="schools_in_town()"
            item-title="name"
            return-object
            variant="underlined"
            class="w-100 mb-1 mt-8"
          ></v-select>

          <v-select
            label="Класс"
            v-model="grade.value.value"
            :error-messages="grade.errors.value"
            :items="grades()"
            item-title="digit"
            item-value="number"
            variant="underlined"
            class="w-100 mb-1 mt-6"
          ></v-select>

          <v-radio-group
            v-model="mentor"
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
          
          <v-checkbox 
            v-model="agree.value.value"
            :error-messages="agree.errors.value"
            class="w-100 mt-4 ma-0 pa-0 align-start"
          >  
            <template v-slot:label>
              <div class="text-start">
                Принимаю <router-link to="/termsOfUse">пользовательское соглашение</router-link>
              </div>  
            </template>  
          </v-checkbox>  

          <v-btn 
            type="submit" 
            :disabled="!meta.valid" 
            color="accent"
            class="mt-6"
          >
            Отправить
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
