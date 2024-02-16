<script setup lang="ts">
import { watch, ref, Ref, reactive } from 'vue';
import BackButton from '../../components/BackButton.vue';
import EntryContainer from '../../components/entries/EntryContainer.vue';
import { FieldContext, useField, useForm } from 'vee-validate'
import { useAuth } from '../../stores/auth';
import { useRouter } from 'vue-router';
import { Contact } from '../../types/contact.type';
import Town from '../../types/town.interface';
import School from '../../types/school.interface';
import { User } from '../../types/user.interface';
import { useTown } from '../../stores/town';
import { useSchool } from '../../stores/school';
import RolesService from '../../services/RolesService';
import _ from 'lodash'
import { storeToRefs } from 'pinia';

localStorage.removeItem('newUser')

document.title = 'Настройки — Ищу наставника'

let auth = useAuth()
let router = useRouter()
let townStore = useTown()
let schoolStore = useSchool()

let user: Ref<User> = storeToRefs(auth).user as any
let towns = townStore.towns

let town = ref<Town>(user.value.school.town)
let grade = ref<number>(user.value.grade)
let roles = ref(user.value.roles)

let mentor = ref(RolesService.isMentor(user.value.roles))

let tab = ref(0)
let tabs = ['Профиль', 'Изменить пароль']
let loading = ref(false)

// Form

const { meta, handleSubmit } = useForm({
  initialValues: {
    name: user.value.name,
    description: user.value.description ?? '',
    contacts: user.value.contacts ?? [],
    school: user.value.school
  },
  validationSchema: {
    name(value: string) {
      if (value.length < 4) return 'слишком короткое имя'
      if (value.length > 21) return 'слишком длинное имя'
      
      return true
    },
    description(value: string) {
      if (value.length > 150) return 'слишком длинное описание'
      
      return true
    },
    contacts(value: Contact[]) {
      for (let item of value) {
        if (item.name.length === 0 || item.link.length === 0)
          return 'в каждом контакте должны быть название и ссылка'
        if (item.name.length > 15)
          return 'слишком длинное название в контакте'
        if (item.link.length > 500)
          return 'кажется тут слишком длинная ссылка'
      }
      return true
    },
    school(value: School | null) {
      if (!value) return 'укажите'

      return true
    }
  }
})

let name = useField<string>('name')
let description = useField<string>('description')
let contacts = useField<Contact[]>('contacts')
let school = useField<School | null>('school')

let schools_in_town = ref(await schoolStore.get_all_in_town(town.value._id))
let loading_schools_in_town = ref(false)

// Methods

watch(town, async (new_value, old_value) => {
  if (_.isEqual(new_value, old_value)) return

  school.value.value = null
  loading_schools_in_town.value = true
  schools_in_town.value = await schoolStore.get_all_in_town(town.value._id)
  loading_schools_in_town.value = false
})

watch(mentor, (value) => {
  value ? roles.value.push('mentor') : roles.value = roles.value.filter(item => item !== 'mentor')
})

const submit = handleSubmit(async (values) => {
  loading.value = true

  await auth.updateUser(Object.assign(values, {
    school: values.school._id,
    grade: grade.value,
    roles: roles.value
  }))
  .then(() => router.push(`/user/${user.value._id}`))
  
  loading.value = false
})

function grades() {
  let result = [{ digit: '—', number: 0 }]
  for (let i = 1; i <= 11; i++) result.push({ digit: i.toString(), number: i })
  return result
}
</script>

<template>
  <v-container class="mt-1">
    <BackButton />

    <v-row class="mt-1 align-start">
      <v-col cols="12" md="5" lg="3">
        <EntryContainer class="d-flex flex-column">
          <div 
            v-for="(tab_name, index) in tabs"
            :key="index"
            @click="tab = index" 
            :class="`cursor-pointer pt-1 pb-1 font-weight-semibold ${tab !== index ? 'text-teal-darken-1' : ''}`"
          >
            {{ tab_name }}
          </div>
        </EntryContainer>
      </v-col>

      <v-col>
        <EntryContainer v-if="tab === 0">
          <v-form @submit.prevent="submit">
            <v-row class="mt-1">
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Имя Фамилия"
                  v-model="name.value.value"
                  :error-messages="name.errorMessage.value"
                  placeholder="Василий Петров"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-radio-group
                  label="Кто вы?"
                  v-model="mentor"
                  hide-details
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
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6">
                <v-textarea 
                  label="Описание"
                  v-model="description.value.value"
                  :error-messages="description.errorMessage.value"
                  :counter="150"
                  variant="outlined"
                  class="w-100"
                />
              </v-col>
            </v-row>

            <div class="d-flex flex-column align-start">
              <div class="text-body-1 mb-2 font-weight-bold">
                Контакты
              </div>
              
              <div
                v-if="contacts.value.value.length > 0" 
                class="d-flex flex-column w-100" 
                style="gap: 6px;"
              >
                <v-slide-x-transition group hide-on-leave>
                  <div 
                    class="d-flex flex-row justify-space-between" 
                    v-for="(contact, i) in contacts.value.value" 
                    :key="i"
                  >
                    <v-text-field
                      placeholder="ВКонтакте"
                      v-model="contact.name"
                      style="width: 30% !important;"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />

                    <v-text-field
                      placeholder="https://vk.com/vasiliy"
                      v-model="contact.link"
                      style="width: 40% !important;"
                      variant="outlined"
                      density="compact"
                      class="ml-2"
                      hide-details
                    />

                    <v-btn 
                      @click="contacts.value.value = contacts.value.value.filter((item, index) => index !==i)"
                      variant="text"
                      icon="mdi-minus"
                      class="ml-2 font-weight-semibold text-button"
                    />
                  </div>
                </v-slide-x-transition>
              </div>

              <div class="text-body-2 text-red">
                {{ contacts.errorMessage.value }}
              </div>

              <v-btn 
                @click="contacts.value.value.push({ name: '', link: 'https://' })"
                prepend-icon="mdi-plus"
                variant="tonal"
                :disabled="contacts.value.value.length>3"
                class="text-body-2 mt-2 pl-5 pr-5 font-weight-semibold bg-button"
              >
                Добавить
              </v-btn>
            </div>
            
            <v-row class="mt-8">
              <v-col cols="12" sm="6">
                <v-autocomplete
                  label="Город"
                  v-model="town"
                  :items="towns"
                  item-title="name"
                  auto-select-first
                  :loading="townStore.loading"
                  no-data-text="Не найдено"
                  return-object
                  density="comfortable"
                  variant="outlined"
                  class="w-100"
                  hide-details
                />
              </v-col>
  
              <v-col cols="12" sm="6">
                <v-autocomplete
                  label="Школа"
                  v-model="school.value.value"
                  :error-messages="school.errorMessage.value"
                  :items="schools_in_town"
                  item-title="name"
                  auto-select-first
                  :loading="loading_schools_in_town"
                  return-object
                  density="comfortable"
                  variant="outlined"
                  class="w-100"
                  hide-details
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  label="Класс"
                  v-model="grade"
                  :items="grades()"
                  item-title="digit"
                  item-value="number"
                  density="comfortable"
                  variant="outlined"
                  class="w-100"
                  hide-details
                />
              </v-col>
            </v-row>

            <v-btn
              type="submit"
              :loading="loading"
              :disabled="!meta.valid"
              class="bg-accent mb-2 mt-8"
            >
              Сохранить
            </v-btn>
          </v-form>
        </EntryContainer>
      </v-col>
    </v-row>
  </v-container>
</template>
