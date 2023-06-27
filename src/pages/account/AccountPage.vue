<script setup lang="ts">
import BackButton from '../../components/BackButton.vue';
import EntryContainer from '../../components/entries/EntryContainer.vue';
import MentorEntry from '../../components/entries/MentorEntry.vue';
import { useAuth } from '../../stores/auth';
import { ref, watch } from 'vue';
import { onBeforeRouteUpdate, useRouter } from 'vue-router';
import { useUser } from '../../stores/user';
import { useEntry } from '../../stores/entry';
import { User } from '../../types/user.interface';
import Entry from '../../types/entry.interface';
import RolesService from '../../services/RolesService';

let new_user = eval(localStorage.getItem('newUser') || 'false')

let props = defineProps(['id'])
let id = props.id

let router = useRouter()

let auth = useAuth()
let viewer = auth.getUser()

let userStore = useUser()
let user = ref<User>(viewer?._id === id ? viewer : await userStore.get_by_id(id) as any)
let my_page = ref(viewer?._id === id)
let viewer_is_admin = viewer && (
  RolesService.isAdminOfSchool(viewer.roles, user.value.school._id) || 
  RolesService.isAdminOfTown(viewer.roles, user.value.town._id) || 
  RolesService.isGlobalAdmin(viewer.roles)
)
let viewer_is_some_admin = viewer && RolesService.isSomeAdmin(viewer.roles)

let entryStore = useEntry()

let town = ref(user.value.town)
let school = ref(user.value.school)
let entries = ref(await entryStore.get_by_author(user.value._id))
let mentorship_entries = ref(entries.value?.filter(entry => entry.type === 'mentor' && entry.on_moderation === false && entry.moderation_result === true))
let lesson_entries = ref(entries.value?.filter(entry => entry.type === 'lesson' && entry.on_moderation === false && entry.moderation_result === true))
let club_entries = ref(entries.value?.filter(entry => entry.type === 'club' && entry.on_moderation === false && entry.moderation_result === true))
let entries_on_moderation = ref(entries.value?.filter(entry => entry.on_moderation === true || (my_page.value && entry.on_moderation === false && entry.moderation_result === false)))

function getType(): string {
  if (RolesService.isSomeAdmin(user.value.roles)) {
    return 'админ'
  }
  if (user.value.roles.includes('mentor')) {
    return 'наставник'
  }

  return 'наставляемый'
}

document.title = `${user.value.name} — Ищу наставника`

onBeforeRouteUpdate((to) => {
  window.location.href = to.path
  //user.value = viewer?._id === id ? viewer : await userStore.get_by_id(id) as any
  //town.value = user.value.town
  //school.value = user.value.school
  //entries.value = await entryStore.get_by_author(user.value._id)
  //mentorship_entries.value = entries.value?.filter(entry => entry.type === 'mentor')
  //lesson_entries.value = entries.value?.filter(entry => entry.type === 'lesson')
  //club_entries.value = entries.value?.filter(entry => entry.type === 'club')

  //my_page.value = viewer?._id === id
})

let responsed_entries = ref<Entry[]|undefined>([])
let responsed_mentorship_entries = ref<Entry[]|undefined>([])
let responsed_lesson_entries = ref<Entry[]|undefined>([])
let responsed_club_entries = ref<Entry[]|undefined>([])

if (RolesService.isMentor(user.value.roles)) {
  responsed_entries.value = await userStore.get_my_responses()

  responsed_mentorship_entries.value = responsed_entries.value?.filter(entry => entry.type === 'mentor')
  responsed_lesson_entries.value = responsed_entries.value?.filter(entry => entry.type === 'lesson')
  responsed_club_entries.value = responsed_entries.value?.filter(entry => entry.type === 'club')
}


function removeRank(item: string) {
  user.value.ranks.splice(user.value.ranks.indexOf(item), 1)
}

watch(user.value, async (value) => {
  await userStore.changeUser(value)
})
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
          <div class="text-center" v-if="user.ranks && user.ranks.length != 0">
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

          <v-tooltip
            v-if="new_user"
            location="bottom start"
            activator="parent"
            color="gray"
            model-value 
          >
            Привет, новый пользователь! Ты можешь добавить больше информации о себе
          </v-tooltip>
        </v-btn>          
      </div>
    </div>

    
    <!-- =================== Other ==================== -->

    <template v-if="(viewer_is_admin || viewer_is_some_admin) && !my_page">
      <div class="text-h5 font-weight-bold mt-8">Управление</div>

      <v-col cols="12" lg="6">
        <v-combobox
          v-model="user.ranks"
          chips
          clearable
          label="Звания"
          multiple
          prepend-icon="mdi-chevron-triple-up"
          density="comfortable"
          variant="solo"
          class="mt-2"
          hide-details
        >
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip
              v-bind="attrs"
              :model-value="selected"
              closable
              @click="select"
              @click:close="removeRank(item)"
            >
              <strong>{{ item }}</strong>&nbsp;
            </v-chip>
          </template>
        </v-combobox>
      </v-col>

      <v-btn
        prepend-icon="mdi-star"
      >
        Дать награду
      </v-btn>

    </template>

    <template v-if="(my_page || viewer_is_admin) && entries_on_moderation && entries_on_moderation.length>0">
      <v-row
        class="flex-column mt-8 w-100"
      >
        <div class="text-h5 font-weight-bold">На модерации</div>
  
        <div class="mt-6 entries-container">
          <MentorEntry 
            v-for="entry in entries_on_moderation"
            :key="entry._id"
            hide_user 
            :entry="entry" 
            :show_location="false" 
          />
        </div>
      </v-row>
    </template>

    <template v-if="my_page && !user.roles.includes('mentor') && responsed_entries && responsed_entries.length>0">
      <div class="text-h5 mb-4 mt-8 font-weight-bold">Мои отклики</div>

      <div 
        v-if="responsed_mentorship_entries?.length !== 0" 
        class="pt-2 pb-4 entries-container"
      >
        <MentorEntry 
          v-for="entry in responsed_mentorship_entries"
          :key="entry?._id"
          hide_user 
          :entry="entry" 
          :show_location="false" 
        />
      </div>

      <!-- Lessons -->
      <v-row
        class="flex-column pt-4 pb-4 ma-0 pa-0"
        v-if="responsed_lesson_entries?.length !== 0"
      >
        <div 
          class="text-h5 mb-4 font-weight-bold" 
          v-if="responsed_mentorship_entries?.length!==0"
        >
          Уроки
        </div>

        <div class="entries-container">
          <MentorEntry 
            v-for="entry in responsed_lesson_entries"
            :key="entry._id"
            hide_user 
            :entry="entry" 
            :show_location="false" 
          />
        </div>
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

        <div class="entries-container">
          <MentorEntry 
            v-for="entry in responsed_club_entries"
            :key="entry._id"
            hide_user 
            :entry="entry" 
            :show_location="false" 
          />
        </div>
      </v-row>
    </template>

    <template v-if="user.roles.includes('mentor') || (entries && entries.length>0)">
      <!-- Mentor -->
      <v-row
        class="flex-column mt-8 w-100 ma-0 pa-0"
        v-if="mentorship_entries?.length !== 0"
      >
        <div class="text-h5 font-weight-bold">Наставник по</div>
  
        <div class="entries-container mt-6">
          <MentorEntry 
            v-for="entry in mentorship_entries"
            :key="entry._id"
            hide_user 
            :entry="entry" 
            :show_location="false" 
          />
        </div>
      </v-row>
  
      <!-- Lessons -->
      <v-row
        class="flex-column mt-8 ma-0 pa-0"
        v-if="lesson_entries?.length !== 0"
      >
        <div class="text-h5 font-weight-bold">Уроки</div>
  
        <div class="mt-4 entries-container">
          <MentorEntry 
            v-for="entry in lesson_entries"
            :key="entry._id"
            hide_user 
            :entry="entry" 
            :show_location="false" 
          />
        </div>
      </v-row>
  
      <!-- Clubs -->
      <v-row
        class="flex-column mt-8 ma-0 pa-0"
        v-if="club_entries?.length !== 0"
      >
        <div class="text-h5 font-weight-bold">Клубы</div>
  
        <div class="mt-4 entries-container">
          <MentorEntry 
            v-for="entry in club_entries"
            :key="entry._id"
            hide_user 
            :entry="entry" 
            :show_location="false" 
          />
        </div>
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
