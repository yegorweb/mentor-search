<script setup lang="ts">
import BackButton from '../../components/BackButton.vue';
import MentorEntry from '../../components/entries/MentorEntry.vue';
import { useAuth } from '../../stores/auth';
import { reactive, watch, ref } from 'vue';
import { onBeforeRouteUpdate, useRouter } from 'vue-router';
import { useUser } from '../../stores/user';
import { useEntry } from '../../stores/entry';
import { User } from '../../types/user.interface';
import Entry from '../../types/entry.interface';
import RolesService from '../../services/RolesService';
import { useTown } from '../../stores/town';
import RolesControl from '../../components/RolesControl.vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';

let new_user = localStorage.getItem('newUser')

let router = useRouter()
let auth = useAuth()
let userStore = useUser()
let entryStore = useEntry()

let props = defineProps(['id'])
let id = props.id

let viewer = auth.user
let user = reactive(viewer && viewer._id === id ? viewer : await userStore.get_by_id(id) as User)

document.title = `${user.name} — Ищу наставника`

let my_page = viewer?._id === id
let viewer_is_admin = viewer && (
  RolesService.isAdminOfSchool(viewer.roles, user.school._id) || 
  RolesService.isAdminOfTown(viewer.roles, user.school.town._id) || 
  RolesService.isGlobalAdmin(viewer.roles)
)
let viewer_is_some_admin = viewer && RolesService.isSomeAdmin(viewer.roles)

let loading = ref(false)
let entries = ref<Entry[]>([])
let mentorship_entries = ref<Entry[]>([])
let lesson_entries = ref<Entry[]>([])
let club_entries = ref<Entry[]>([])
let responsed_entries = ref<Entry[]>([])
let entries_on_moderation = ref<Entry[]>([])

async function fetchEntries() {
  loading.value = true
  entries.value = my_page ? await entryStore.get_my_entries() : await entryStore.get_by_author(user._id)

  updateEntries()

  if (my_page && !RolesService.isMentor(user.roles)) {
    responsed_entries.value = await userStore.get_my_responses()
  }
  loading.value = false
}
fetchEntries()

function updateEntries(): void {
  mentorship_entries.value = entries.value.filter(entry => my_page ? entry.type === 'mentor' && entry.on_moderation === false && entry.moderation_result === true : entry.type === 'mentor')
  lesson_entries.value = entries.value.filter(entry => my_page ? entry.type === 'lesson' && entry.on_moderation === false && entry.moderation_result === true : entry.type === 'lesson')
  club_entries.value = entries.value.filter(entry => my_page ? entry.type === 'club' && entry.on_moderation === false && entry.moderation_result === true : entry.type === 'club')

  if (my_page) {
    entries_on_moderation.value = entries.value.filter(entry => entry.on_moderation === true || (my_page && entry.on_moderation === false && entry.moderation_result === false))
  }
}

let roles_control_status = ref(false)

watch(user, async (value) => {
  userStore.changeUser(value)
})

onBeforeRouteUpdate((to) => {
  window.location.href = to.path
})

async function logout() {
  await auth.logout()
  window.location.href = '/'
}

function removeRank(item: string) {
  user.ranks.splice(user.ranks.indexOf(item), 1)
}

function removeEntry(_id: string): void {
  entries.value = entries.value.filter(entry => entry._id !== _id)
  updateEntries()
}
</script>

<template>
  <v-container class="mt-1">
    <!-- =================== Top bar ==================== -->

    <div class="d-flex flex-row w-100 flex-nowrap justify-space-between align-center">
      <BackButton />
      
      <div 
        v-if="my_page" 
        @click="logout" 
        class="d-flex pt-1 pr-1 pb-1 cursor-pointer flex-row flex-nowrap align-center justify-start"
      >
        <v-icon>mdi-logout</v-icon>
        
        <div class="text-body-4 ml-1 font-weight-semibold">
          выйти
        </div>
      </div>
    </div>

    <!-- =================== User Card ==================== -->
    <div
      style="column-gap: 30px; row-gap: 10px;" 
      class="box w-100 mt-4 mb-4 d-flex flex-column flex-sm-row flex-nowrap justify-center justify-sm-start align-center align-sm-start"
    >
      <!-- Avatar -->
      <v-avatar 
        :image="user.avatar_url ?? ''" 
        color="blue" 
        size="130"
      />
  
      <div class="d-flex flex-column justify-center justify-sm-start w-sm-100 align-center align-sm-start">
        <!-- Name -->
        <div class="text-h5 text-center font-weight-bold">
          {{ user.name }}
        </div>
        
        <!-- Info -->
        <div 
          style="column-gap: 20px;" 
          class="d-flex mt-1 align-center justify-center justify-sm-start flex-wrap flex-row font-weight-bold text-text_gray"
        >
          <div>{{ RolesService.getType(user.roles) }}</div>
          
          <div 
            v-if="user.ranks && user.ranks.length > 0"
            class="text-center" 
          >
            <span class="mdi mdi-star" />
            {{ user.ranks.join(', ') }}
          </div>
          
          <div v-if="user.grade !== 0">
            {{ user.grade }} класс
          </div>
        </div>

        <!-- Town, school -->
        <div class="font-weight-bold text-text_gray">
          {{ user.school.town.name + ', ' + user.school.name }}
        </div>

        <!-- Description -->
        <div 
          v-if="user.description && user.description.length > 0"
          class="mt-2 pb-2 text-justify text-sm-start" 
        >
          {{ user.description }}
        </div>

        <!-- Contacts -->
        <div
          v-if="user.contacts && user.contacts.length > 0"
          class="d-flex pt-2 flex-row flex-wrap justify-center justify-sm-start" 
          style="column-gap: 12px; row-gap: 6px;"
        >
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
              class="text-body-2 pl-5 pr-5 font-weight-semibold bg-button"
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
            :location="useDisplay().mdAndUp.value ? 'bottom start' : 'bottom center'"
            activator="parent"
            color="gray"
            model-value 
          >
            Привет, новый пользователь! Ты можешь добавить больше о себе
          </v-tooltip>
        </v-btn>          
      </div>
    </div>

    
    <!-- =================== Other ==================== -->

    <!-- Admin -->
    <div 
      v-if="viewer_is_admin && !my_page"
      class="pt-4 pb-4"
    >
      <div class="text-h5 font-weight-bold">
        Управление
      </div>

      <v-col cols="12" lg="6" class="pa-0 mt-4">
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
  
      <v-row class="mt-3 d-flex flex-row flex-wrap">
        <v-col cols="auto">
          <v-btn
            prepend-icon="mdi-star"
          >
            Дать награду
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            v-if="!RolesService.isSomeAdmin(user.roles)"
            prepend-icon="mdi-delete"
            class="bg-red"
          >
            Удалить
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            @click="roles_control_status = !roles_control_status"
            prepend-icon="mdi-security"
          >
            Роли
          
            <RolesControl 
              v-model="roles_control_status"
              v-model:roles="user.roles"
            />
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <div v-if="loading" class="d-flex pt-4 justify-center w-100">
      <v-progress-circular 
        indeterminate
        color="primary"
      />
    </div>

    <template v-if="!loading">
      <!-- On moderation -->
      <div 
        v-if="(my_page || viewer_is_admin) && entries_on_moderation.length > 0"
        class="d-flex flex-column pt-4 pb-4 w-100"
      >
        <div class="text-h5 font-weight-bold">На модерации</div>

        <div class="mt-4 entries-container">
          <MentorEntry 
            v-for="entry in entries_on_moderation"
            :key="entry._id"
            @delete="removeEntry"
            hide_user 
            :my_entry="entry.author._id === viewer?._id"
            :entry="entry" 
            :show_location="false" 
          />
        </div>
      </div>

      <!-- My responses -->
      <div 
        v-if="my_page && !RolesService.isMentor(user.roles) && responsed_entries.length > 0"
        class="d-flex flex-column pt-4 pb-4 w-100" 
      >
        <div class="text-h5 mt-8 font-weight-bold">
          Мои отклики
        </div>

        <div class="mt-4 entries-container">
          <MentorEntry 
            v-for="entry in responsed_entries"
            :key="entry._id"
            hide_user 
            :my_entry="entry.author._id === viewer?._id"
            :entry="entry" 
            :show_location="false" 
          />
        </div>
      </div>

      <!-- Mentorship entries -->
      <div
        v-if="mentorship_entries.length > 0"
        class="d-flex flex-column pt-4 pb-4 w-100"
      >
        <div class="text-h5 font-weight-bold">
          Наставник по
        </div>

        <div class="entries-container mt-4">
          <MentorEntry 
            v-for="entry in mentorship_entries"
            :key="entry._id"
            @delete="removeEntry"
            hide_user 
            :my_entry="entry.author._id === viewer?._id"
            :entry="entry" 
            :show_location="false" 
          />
        </div>
      </div>

      <!-- Lessons entries -->
      <div
        v-if="lesson_entries.length > 0"
        class="d-flex flex-column pt-4 pb-4"
      >
        <div class="text-h5 font-weight-bold">
          Уроки
        </div>

        <div class="mt-4 entries-container">
          <MentorEntry 
            v-for="entry in lesson_entries"
            :key="entry._id"
            @delete="removeEntry"
            :my_entry="entry.author._id === viewer?._id"
            hide_user 
            :entry="entry" 
            :show_location="false" 
          />
        </div>
      </div>

      <!-- Clubs entries -->
      <div
        v-if="club_entries.length > 0"
        class="d-flex flex-column pt-4 pb-4"
      >
        <div class="text-h5 font-weight-bold">
          Клубы
        </div>

        <div class="mt-4 entries-container">
          <MentorEntry 
            v-for="entry in club_entries"
            :key="entry._id"
            @delete="removeEntry"
            :my_entry="entry.author._id === viewer?._id"
            hide_user 
            :entry="entry" 
            :show_location="false" 
          />
        </div>
      </div>
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
