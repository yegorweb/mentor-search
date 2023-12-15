<script setup lang="ts">
import { ref } from 'vue';
import MentorEntry from '../../components/entries/MentorEntry.vue';
import MainTitle from '../../components/MainTitle.vue';
import { useUser } from '../../stores/user';
import Entry from '../../types/entry.interface';

document.title = 'Мои отклики — Ищу наставника'

let userStore = useUser()

let entries = ref<Entry[]>([])
let mentorship_entries = ref<Entry[]>([])
let lesson_entries = ref<Entry[]>([])
let club_entries = ref<Entry[]>([])
let loading = ref(false)

function updateEntries() {
  mentorship_entries.value = entries.value.filter(entry => entry.type === 'mentor')
  lesson_entries.value = entries.value.filter(entry => entry.type === 'lesson')
  club_entries.value = entries.value.filter(entry => entry.type === 'club')
}

async function fetchEntries() {
  loading.value = true
  entries.value = await userStore.get_my_responses()
  updateEntries()
  loading.value = false 
}
fetchEntries()

function onDeleteEntry(_id: string) {
  entries.value = entries.value.filter(entry => entry._id !== _id)
  updateEntries()
}
</script>

<template>
  <v-container>
    <MainTitle class="pb-3">
      Мои отклики
    </MainTitle>

    <div v-if="loading" class="d-flex mt-4 justify-center">
      <v-progress-circular 
        indeterminate
        color="primary"
      />
    </div>

    <template v-if="!loading">
      <div
        v-if="mentorship_entries.length > 0" 
        class="entries-container pt-4 pb-4"
      >
        <MentorEntry 
          v-for="entry in mentorship_entries"
          @delete="onDeleteEntry"
          :key="entry._id"
          :entry="entry" 
        />
      </div>

      <!-- Lessons -->
      <div
        v-if="lesson_entries.length > 0"
        class="d-flex flex-column pt-4 pb-4"
      >
        <div 
          v-if="mentorship_entries.length > 0"
          class="text-h5 mb-4 font-weight-bold" 
        >
          Уроки
        </div>

        <div class="entries-container">
          <MentorEntry 
            v-for="entry in lesson_entries"
            @delete="onDeleteEntry"
            :key="entry._id"
            :entry="entry" 
          />
        </div>
      </div>

      <!-- Clubs -->
      <div
        v-if="club_entries.length > 0"
        class="d-flex flex-column pt-4"
      >
        <div 
          v-if="mentorship_entries.length > 0 || lesson_entries.length > 0"
          class="text-h5 mb-4 font-weight-bold" 
        >
          Клубы
        </div>

        <div class="entries-container">
          <MentorEntry 
            v-for="entry in club_entries"
            @delete="onDeleteEntry"
            :key="entry._id"
            :entry="entry" 
          />
        </div>
      </div>

      <div 
        v-if="entries.length === 0"
        class="d-flex mt-3 flex-column align-center align-sm-start" 
      >
        <div class="text-h5 w-100 text-center font-weight-semibold">
          У вас нет откликов 😱
        </div>
        
        <v-btn 
          size="small"
          variant="tonal" 
          class="text-body-2 pl-5 pr-5 ma-auto mt-4 font-weight-semibold bg-button"
          to="/search-mentors"
        >
          Найти наставника
        </v-btn>
      </div>
    </template>
  </v-container>
</template>
