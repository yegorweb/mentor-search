<script setup lang="ts">
import BackButton from '../../components/BackButton.vue';
import EntryContainer from '../../components/entries/EntryContainer.vue';
import MentorEntry from '../../components/entries/MentorEntry.vue';
import { useAuth } from '../../stores/auth';
import { ref, Ref } from 'vue';
import { onBeforeRouteUpdate, useRouter } from 'vue-router';
import { useUser } from '../../stores/user';
import { useEntry } from '../../stores/entry';
import { User } from '../../types/user.interface';
import Entry from '../../types/entry.interface';

let props = defineProps(['id'])
let id = props.id

let router = useRouter()

let auth = useAuth()
let viewer = auth.getUser()

let userStore = useUser()
let user: Ref<User> = ref(viewer?._id === id ? viewer : await userStore.get_by_id(id)) as any
let my_page = ref(viewer?._id === id)
let viewer_is_admin = (viewer?.roles.includes('school-admin') && viewer?.administered_schools?.includes(user.value?.school)) || viewer?.roles?.includes('global-admin')

let entryStore = useEntry()

let town = ref(user.value.town)
let school = ref(user.value.school)
let entries = ref(await entryStore.get_by_author(user.value._id))
let mentorship_entries = ref(entries.value?.filter(entry => entry.type === 'mentor' && entry.on_moderation === false && entry.moderation_result === true))
let lesson_entries = ref(entries.value?.filter(entry => entry.type === 'lesson' && entry.on_moderation === false && entry.moderation_result === true))
let club_entries = ref(entries.value?.filter(entry => entry.type === 'club' && entry.on_moderation === false && entry.moderation_result === true))
let entries_on_moderation = ref(entries.value?.filter(entry => entry.on_moderation === true || (my_page.value && entry.on_moderation === false && entry.moderation_result === false)))

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
  user.value = viewer?._id === id ? viewer : await userStore.get_by_id(id) as any
  town.value = user.value.town
  school.value = user.value.school
  entries.value = await entryStore.get_by_author(user.value._id)
  mentorship_entries.value = entries.value?.filter(entry => entry.type === 'mentor')
  lesson_entries.value = entries.value?.filter(entry => entry.type === 'lesson')
  club_entries.value = entries.value?.filter(entry => entry.type === 'club')

  my_page.value = viewer?._id === id
})

let responsed_entries: Ref<Entry[]|undefined> = ref([])
let responsed_mentorship_entries: Ref<Entry[]|undefined> = ref([])
let responsed_lesson_entries: Ref<Entry[]|undefined> = ref([])
let responsed_club_entries: Ref<Entry[]|undefined> = ref([])

if (!user.value.roles.includes('mentor')) {
  responsed_entries.value = await userStore.get_my_responses()

  responsed_mentorship_entries.value = responsed_entries.value?.filter(entry => entry.type === 'mentor')
  responsed_lesson_entries.value = responsed_entries.value?.filter(entry => entry.type === 'lesson')
  responsed_club_entries.value = responsed_entries.value?.filter(entry => entry.type === 'club')
}
</script>

<template>
  <v-container class="mt-1">
    <!-- =================== Top bar ==================== -->

    <div class="d-flex flex-row w-100 flex-nowrap justify-space-between align-center">
      <BackButton />
      <div @click="auth.logout" v-if="my_page" class="d-flex pt-1 pr-1 pb-1 cursor-pointer flex-row flex-nowrap align-center justify-start">
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
            v-for="button in user.contacts"
            :key="button.link"
            target="_blank"
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
    
    <template v-if="(my_page || viewer_is_admin) && entries_on_moderation && entries_on_moderation.length>0">
      <v-row
        class="flex-column mt-8 ma-0 pa-0 w-100"
        v-if="entries_on_moderation && entries_on_moderation.length > 0"
      >
        <div class="text-h5 font-weight-bold">На модерации</div>
  
        <v-row class="w-100 mt-4 flex-row flex-wrap">
          <v-col
            v-for="entry in entries_on_moderation"
            :key="entry._id"
            cols="12" sm="6" xs="12"
          >
            <MentorEntry hide_user :entry="entry" :show_location="false" />
          </v-col>
        </v-row>
      </v-row>
    </template>

    <template v-if="my_page && !user.roles.includes('mentor') && responsed_entries && responsed_entries.length>0">
      <div class="text-h5 mb-4 mt-8 font-weight-bold">Мои отклики</div>

      <v-row v-if="responsed_mentorship_entries?.length !== 0" class="pt-2 pb-4">
        <v-col 
          v-for="entry in responsed_mentorship_entries"
          :key="entry?._id"
          cols="12" sm="6" xs="12"
        >
          <MentorEntry hide_user :entry="entry" :show_location="false" />
        </v-col>
      </v-row>

      <!-- Lessons -->
      <v-row
        class="flex-column pt-4 pb-4 ma-0 pa-0"
        v-if="responsed_lesson_entries?.length !== 0"
      >
        <div 
          class="text-h5 mb-4 font-weight-bold" 
          v-if="responsed_mentorship_entries?.length!==0"
        >Уроки</div>

        <v-row class="w-100 flex-row flex-wrap">
          <v-col
            v-for="entry in responsed_lesson_entries"
            :key="entry._id"
            cols="12" sm="6" xs="12"
          >
            <MentorEntry hide_user :entry="entry" :show_location="false" />
          </v-col>
        </v-row>
      </v-row>

      <!-- Clubs -->
      <v-row
        class="flex-column pt-4 ma-0 pa-0"
        v-if="responsed_club_entries?.length !== 0"
      >
        <div 
          class="text-h5 mb-4 font-weight-bold" 
          v-if="responsed_mentorship_entries?.length!==0 || responsed_lesson_entries?.length!==0"
        >Клубы</div>

        <v-row class="w-100 flex-row flex-wrap">
          <v-col
            v-for="entry in responsed_club_entries"
            :key="entry._id"
            cols="12" sm="6" xs="12"
          >
            <MentorEntry hide_user :entry="entry" :show_location="false" />
          </v-col>
        </v-row>
      </v-row>
    </template>

    <template v-if="user.roles.includes('mentor') || (entries && entries.length>0)">
      <!-- Mentor -->
      <v-row
        class="flex-column mt-8 ma-0 pa-0 w-100"
        v-if="mentorship_entries?.length !== 0"
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
        v-if="lesson_entries?.length !== 0"
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
        v-if="club_entries?.length !== 0"
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
