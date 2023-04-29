<script setup lang="ts">
import BackButton from '../../components/BackButton.vue';
import EntryContainer from '../../components/entries/EntryContainer.vue';
import MentorEntry from '../../components/entries/MentorEntry.vue';
import EntryService from '../../services/EntryService';
import UserService from '../../services/UserService'
import { useAuth } from '../../stores/auth';
import { ref } from 'vue';
import { onBeforeRouteUpdate, useRouter } from 'vue-router';

let props = defineProps(['id'])
let router = useRouter()

let auth = useAuth()

let id = props.id
let user = ref(auth.getUser()._id === id ? auth.getUser() : (await UserService.get_by_id(id)).data)
let town = ref(user.value.town)
let school = ref(user.value.school)
let entries = ref((await EntryService.get_by_author(user.value._id)).data)
let mentorship_entries = ref(entries.value.filter(entry => entry.type === 'mentor'))
let lesson_entries = ref(entries.value.filter(entry => entry.type === 'lesson'))
let club_entries = ref(entries.value.filter(entry => entry.type === 'club'))

let my_page = ref(auth.getUser()._id === id)

function getType(): string {
  if (user.value.roles?.includes('school-admin') || user.value.roles?.includes('global-admin')) {
    return 'админ'
  }
  if (user.value.roles?.includes('mentor')) {
    return 'наставник'
  }

  return 'наставляемый'
}

document.title = `${user.value.name} — Ищу наставника`

onBeforeRouteUpdate(async () => {
  id = props.id
  user.value = auth.getUser()._id === id ? auth.getUser() : (await UserService.get_by_id(id)).data
  town.value = user.value.town
  school.value = user.value.school
  entries.value = (await EntryService.get_by_author(user.value._id)).data
  mentorship_entries.value = entries.value.filter(entry => entry.type === 'mentor')
  lesson_entries.value = entries.value.filter(entry => entry.type === 'lesson')
  club_entries.value = entries.value.filter(entry => entry.type === 'club')

  my_page.value = auth.getUser()._id === id
})

async function logout() {
  await auth.logout()
  window.location.href = '/'
}

let responsed_entries = ref([])
let responsed_mentorship_entries = ref([])
let responsed_lesson_entries = ref([])
let responsed_club_entries = ref([])

if (!user.value.roles.includes('mentor')) {
  responsed_entries.value = (await UserService.get_my_responses()).data

  responsed_mentorship_entries.value = responsed_entries.value.filter(entry => entry.type === 'mentor')
  responsed_lesson_entries.value = responsed_entries.value.filter(entry => entry.type === 'lesson')
  responsed_club_entries.value = responsed_entries.value.filter(entry => entry.type === 'club')
}
</script>

<template>
  <v-container class="mt-1">
    <!-- =================== Top bar ==================== -->

    <div class="d-flex flex-row w-100 flex-nowrap justify-space-between align-center">
      <BackButton />
      <div @click="logout" v-if="my_page" class="d-flex pt-1 pr-1 pb-1 cursor-pointer flex-row flex-nowrap align-center justify-start">
        <v-icon icon="mdi-logout"></v-icon>
        <div class="text-body-4 ml-1 font-weight-semibold">выйти</div>
      </div>
    </div>

    <!-- =================== User Card ==================== -->
    <div
      style="column-gap: 30px;row-gap: 10px;" 
      class="box w-100 mt-4 d-flex flex-column flex-sm-row flex-nowrap justify-center justify-sm-start align-center align-sm-start"
    >
      <!-- Avatar -->
      <v-avatar :image="user?.avatar_url" color="blue" size="130"></v-avatar>
  
      <div class="d-flex flex-column justify-center justify-sm-start w-sm-100 align-center align-sm-start">
        <!-- Name -->
        <div class="text-h5 text-center font-weight-bold">{{ user?.name }}</div>
        
        <!-- Info -->
        <div 
          style="column-gap: 20px;" 
          class="d-flex mt-1 align-center justify-center justify-sm-start flex-wrap flex-row font-weight-bold text-text_gray"
        >
          <div>{{ getType() }}</div>
          <div v-if="user.ranks && user.ranks.length != 0">
            <span><v-icon icon="mdi-star"></v-icon></span>
            {{ user.ranks.join(', ') }}
          </div>
          <div v-if="user.grade != 0">{{ user.grade }} класс</div>
        </div>

        <!-- Town, school -->
        <div class="font-weight-bold text-text_gray">
          {{ town.name + ', ' + school.name }}
        </div>

        <!-- Description -->
        <div class="mt-2 pb-2 text-center text-sm-start" v-if="user.description && user.description.length>0">
          {{ user.description }}
        </div>

        <!-- Contacts -->
        <div class="d-flex pt-2 flex-row flex-wrap" v-if="user.contacts && user.contacts.length>0">
          <a 
            v-for="button in user?.contacts"
            :key="button.link"
            about="_blank"
            :href="button.link"
            style="text-decoration: none;"
          >
            <v-btn 
              size="small"
              variant="tonal" 
              class="text-body-2 pl-5 pr-5 mr-3 font-weight-semibold bg-button"
              >
              {{ button.name }}
            </v-btn>          
          </a>
        </div>

        <v-btn 
          v-if="my_page"
          size="small"
          variant="tonal" 
          to="/settings"
          class="text-body-2 mt-2 pl-5 pr-5 font-weight-semibold bg-blue"
        >
          Редактировать профиль
        </v-btn>          
      </div>
    </div>

    
    <!-- =================== Other ==================== -->
    
    <template v-if="my_page && !user.roles.includes('mentor') && responsed_entries.length>0">
      <div class="text-h5 mb-4 mt-8 font-weight-bold">Мои отклики</div>

      <v-row v-if="responsed_mentorship_entries.length !== 0" class="pt-2 pb-4">
        <v-col 
          v-for="entry in responsed_mentorship_entries"
          :key="entry?._id"
          cols="12" sm="6" xs="12"
        >
          <MentorEntry :entry="entry" />
        </v-col>
      </v-row>

      <!-- Lessons -->
      <v-row
        class="flex-column pt-4 pb-4 ma-0 pa-0"
        v-if="responsed_lesson_entries.length !== 0"
      >
        <div 
          class="text-h5 mb-4 font-weight-bold" 
          v-if="responsed_mentorship_entries.length!==0"
        >Уроки</div>

        <v-row class="w-100 flex-row flex-wrap">
          <v-col
            v-for="entry in responsed_lesson_entries"
            :key="entry._id"
            cols="12" sm="6" xs="12"
          >
            <MentorEntry :entry="entry" />
          </v-col>
        </v-row>
      </v-row>

      <!-- Clubs -->
      <v-row
        class="flex-column pt-4 ma-0 pa-0"
        v-if="responsed_club_entries.length !== 0"
      >
        <div 
          class="text-h5 mb-4 font-weight-bold" 
          v-if="responsed_mentorship_entries.length!==0 || responsed_lesson_entries.length!==0"
        >Клубы</div>

        <v-row class="w-100 flex-row flex-wrap">
          <v-col
            v-for="entry in responsed_club_entries"
            :key="entry._id"
            cols="12" sm="6" xs="12"
          >
            <MentorEntry :entry="entry" />
          </v-col>
        </v-row>
      </v-row>
    </template>

    <template v-if="user.roles.includes('mentor') || entries.length>0">
      <!-- Mentor -->
      <v-row
        class="flex-column mt-8 ma-0 pa-0 w-100"
        v-if="mentorship_entries.length !== 0"
      >
        <div class="text-h5 font-weight-bold">Наставник по</div>
  
        <v-row class="w-100 mt-4 flex-row flex-wrap">
          <v-col
            v-for="entry in mentorship_entries"
            :key="entry._id"
            cols="12" sm="6" xs="12"
          >
            <MentorEntry hide_user :entry="entry" :show_location="false" />
          </v-col>
        </v-row>
      </v-row>
  
      <!-- Lessons -->
      <v-row
        class="flex-column mt-8 ma-0 pa-0"
        v-if="lesson_entries.length !== 0"
      >
        <div class="text-h5 font-weight-bold">Уроки</div>
  
        <v-row class="w-100 mt-4 flex-row flex-wrap">
          <v-col
            v-for="entry in lesson_entries"
            :key="entry._id"
            cols="12" sm="6" xs="12"
          >
            <MentorEntry hide_user :entry="entry" :show_location="false" />
          </v-col>
        </v-row>
      </v-row>
  
      <!-- Clubs -->
      <v-row
        class="flex-column mt-8 ma-0 pa-0"
        v-if="club_entries.length !== 0"
      >
        <div class="text-h5 font-weight-bold">Клубы</div>
  
        <v-row class="w-100 mt-4 flex-row flex-wrap">
          <v-col
            v-for="entry in club_entries"
            :key="entry._id"
            cols="12" sm="6" xs="12"
          >
            <MentorEntry hide_user :entry="entry" :show_location="false" />
          </v-col>
        </v-row>
      </v-row>
    </template>
  </v-container>
</template>

<style scoped lang="scss">
.box {
  padding: 24px 30px;
  background: #FFFFFF;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}
</style>
