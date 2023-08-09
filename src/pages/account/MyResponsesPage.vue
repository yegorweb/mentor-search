<script setup lang="ts">
import { useRouter } from 'vue-router';
import MentorEntry from '../../components/entries/MentorEntry.vue';
import MainTitle from '../../components/MainTitle.vue';
import { useUser } from '../../stores/user';

document.title = 'Мои отклики — Ищу наставника'

let router = useRouter()

let userStore = useUser()
let entries = await userStore.get_my_responses()

let mentorship_entries = entries.filter(entry => entry.type === 'mentor')
let lesson_entries = entries.filter(entry => entry.type === 'lesson')
let club_entries = entries.filter(entry => entry.type === 'club')
</script>

<template>
  <v-container>
    <MainTitle class="pb-3">
      Мои отклики
    </MainTitle>

    <div
      v-if="mentorship_entries.length > 0" 
      class="entries-container pt-4 pb-4"
    >
        <MentorEntry 
          v-for="entry in mentorship_entries"
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
          :key="entry._id"
          :entry="entry" 
        />
      </div>
    </div>

    <div 
      v-if="entries.length === 0"
      class="d-flex mt-3 flex-column align-center align-sm-start" 
    >
      <div class="text-h5 text-center font-weight-semibold">
        У вас нет откликов 😱
      </div>
      
      <v-btn 
        size="small"
        variant="tonal" 
        class="text-body-2 pl-5 pr-5 ma-auto mt-4 font-weight-semibold bg-button"
        to="/searchMentors"
      >
        Найти наставника
      </v-btn>
    </div>
  </v-container>
</template>
