<script setup lang="ts">
import { watch, ref, Ref } from 'vue';
import BackButton from '../../components/BackButton.vue';
import EntryContainer from '../../components/entries/EntryContainer.vue';
import { FieldContext, useField, useForm } from 'vee-validate'
import { useAuth } from '../../stores/auth';
import { useRouter } from 'vue-router';
import { Contact } from '../../types/contact.type';
import Town from '../../types/town.interface';
import School from '../../types/school.interface';
import { Roles } from '../../types/role.type';
import { User } from '../../types/user.interface';
import { useTown } from '../../stores/town';
import { useSchool } from '../../stores/school';

document.title = 'Натройки — Ищу наставника'

let auth = useAuth()
let router = useRouter()

let user: User = auth.getUser() as any

let tab = ref(1)
let loading = ref(false)

let townStore = useTown()
let schoolStore = useSchool()

let towns = await townStore.get_all()
let schools = await schoolStore.get_all()

function schools_in_town() {
  return schools?.filter(sch => sch.town._id === town.value._id)
}

function grades() {
  let result = [{ digit: '—', number: 0 }]
  for (let i = 1; i <= 11; i++) result.push({ digit: i.toString(), number: i })
  return result
}

const { meta, handleSubmit, handleReset } = useForm({
  initialValues: {
    name: user.name,
    description: user.description,
    contacts: user.contacts ? user.contacts : []
  },
  validationSchema: {
    name(value: string) {
      if (!value || value.length < 4) return 'слишком короткое имя'
      if (value.length > 21) return 'слишком длинное имя'
      
      return true
    },
    description(value: string) {
      if (value && value.length > 150) return 'слишком длинное описание'
      
      return true
    },
    contacts(value: Contact[]) {
      for (let item of value) {
        if (!item.name || item.name.length===0 || !item.link || item.link.length===0)
          return 'в каждом контакте должны быть название и ссылка'
        if (item.name.length > 15)
          return 'слишком длинное название в контакте'
        if (item.link.length > 200)
          return 'кажется тут слишком длинная ссылка'
      }
      return true
    }
  },
})

const submit = handleSubmit(async (values) => {
  loading.value = true

  await auth.updateUser(Object.assign(values, {
    town: town.value._id,
    school: school.value._id,
    grade: grade.value,
    roles: roles.value
  }))
  .then(() => window.location.href = `/user/${user?._id}`)
  .finally(() => loading.value = false)
})

let mentor = ref(user?.roles.includes('mentor'))

watch(mentor, (value: boolean) => {
  value ? roles.value.push('mentor') : roles.value = roles.value.filter(item => item !== 'mentor')
})

let name: FieldContext<string> = useField('name')
let description: FieldContext<string> = useField('description')
let contacts: FieldContext<Contact[]> = useField('contacts')

let town = ref<Town>(user.town)
let school = ref<School>(user.school)
let grade = ref<number>(user.grade)
let roles = ref(user.roles)
</script>

<template>
  <v-container>
    <BackButton />

    <v-row class="mt-1 align-start">
      <v-col cols="12" md="5" lg="4" xl="3">
        <EntryContainer v-show="tab === 1">
          <div class="d-flex flex-column">
            <div 
              @click="tab = 1" 
              :class="`cursor-pointer pt-1 pb-1 font-weight-semibold ${tab !== 1 ? 'text-teal-darken-1':''}`"
            >Редактрировать профиль</div>
            <div 
              @click="tab = 2" 
              :class="`cursor-pointer pt-1 pb-1 font-weight-semibold ${tab !== 2 ? 'text-teal-darken-1':''}`"
            >Изменить пароль</div>
            <div 
              @click="tab = 3" 
              :class="`cursor-pointer pt-1 pb-1 font-weight-semibold ${tab !== 3 ? 'text-teal-darken-1':''}`"
            >Мои подписки</div>
          </div>
        </EntryContainer>
      </v-col>

      <v-col>
        <EntryContainer v-if="tab === 1">
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
                  ></v-radio>
                  <v-radio
                    label="Наставник"
                    :value="true"
                  ></v-radio>
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
            <v-row>
              <v-col cols="12">
                <v-row class="flex-column align-start ma-0 pa-0">
                  <div class="text-body-1 mb-2 font-weight-bold">Контакты</div>
                  <v-row v-if="contacts.value.value.length>0" class="flex-column mb-2 ma-0 pa-0 w-100" style="gap: 6px;">
                    <TransitionGroup name="list">
                      <v-row class="flex-row justify-space-between align-stretch ma-0 pa-0" v-for="(contact, i) in contacts.value.value" :key="i">
                        <v-text-field
                          placeholder="ВКонтакте"
                          v-model="contact.name"
                          variant="outlined"
                          density="compact"
                          class="w-30"
                          hide-details
                        />
                        <v-text-field
                          placeholder="vk.com/vasiliy"
                          v-model="contact.link"
                          variant="outlined"
                          density="compact"
                          class="ml-2"
                          hide-details
                        />
                        <v-btn 
                          variant="tonal"
                          @click="contacts.value.value = contacts.value.value.filter((item, index) => index !==i)"
                          class="ml-2 font-weight-semibold bg-button"
                        ><v-icon>mdi-delete</v-icon></v-btn>
                      </v-row>
                    </TransitionGroup>
                  </v-row>
  
                  <div class="text-body-2 text-red">{{ contacts.errorMessage.value }}</div>

                  <v-btn 
                    prepend-icon="mdi-plus"
                    variant="tonal"
                    :disabled="contacts.value.value.length>3"
                    @click="contacts.value.value.push({ name: '', link: 'http://' })"
                    class="text-body-2 pl-5 pr-5 font-weight-semibold bg-button"
                  >Добавить</v-btn>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="mt-8">
              <v-col cols="12" sm="6">
                <v-select
                  label="Город"
                  v-model="town"
                  :items="towns"
                  item-title="name"
                  return-object
                  density="comfortable"
                  variant="outlined"
                  class="w-100"
                  hide-details
                ></v-select>
              </v-col>
  
              <v-col cols="12" sm="6">
                <v-select
                  label="Школа"
                  v-model="school"
                  :items="schools_in_town()"
                  item-title="name"
                  return-object
                  density="comfortable"
                  variant="outlined"
                  class="w-100"
                  hide-details
                ></v-select>
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
                ></v-select>
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

<style lang="scss" scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>