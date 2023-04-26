<script setup lang="ts">
import { useRouter } from 'vue-router';
import MentorEntry from '../../components/entries/MentorEntry.vue';
import MainTitle from '../../components/MainTitle.vue';
import UserService from '../../services/UserService';

document.title = 'Мои отклики — Ищу наставника'

let router = useRouter()

let entries = (await UserService.get_my_responses()).data

let mentorship_entries = entries.filter(entry => entry.type === 'mentor')
let lesson_entries = entries.filter(entry => entry.type === 'lesson')
let club_entries = entries.filter(entry => entry.type === 'club')
</script>

<template>
  <v-container>
    <MainTitle class="pb-3">Мои отклики</MainTitle>

    <v-row v-if="mentorship_entries.length !== 0" class="pt-4 pb-4">
      <v-col 
        v-for="entry in mentorship_entries"
        :key="entry?.id"
        cols="12" sm="6" xs="12"
      >
        <MentorEntry :entry="entry" />
      </v-col>
    </v-row>

    <!-- Lessons -->
    <v-row
      class="flex-column pt-4 pb-4 ma-0 pa-0"
      v-if="lesson_entries.length !== 0"
    >
      <div 
        class="text-h5 mb-4 font-weight-bold" 
        v-if="mentorship_entries.length!==0"
      >Уроки</div>

      <v-row class="w-100 flex-row flex-wrap">
        <v-col
          v-for="entry in lesson_entries"
          :key="entry.id"
          cols="12" sm="6" xs="12"
        >
          <MentorEntry :entry="entry" />
        </v-col>
      </v-row>
    </v-row>

    <!-- Clubs -->
    <v-row
      class="flex-column pt-4 ma-0 pa-0"
      v-if="club_entries.length !== 0"
    >
      <div 
        class="text-h5 mb-4 font-weight-bold" 
        v-if="mentorship_entries.length!==0 || lesson_entries.length!==0"
      >Клубы</div>

      <v-row class="w-100 flex-row flex-wrap">
        <v-col
          v-for="entry in club_entries"
          :key="entry.id"
          cols="12" sm="6" xs="12"
        >
          <MentorEntry :entry="entry" />
        </v-col>
      </v-row>
    </v-row>

    <div class="d-flex mt-3 align-center ma-auto flex-column justify-center" v-if="entries.length===0">
      <div class="text-h5 text-center font-weight-semibold">У вас нет наставников 😱</div>
      <v-btn 
        size="small"
        variant="tonal" 
        class="text-body-2 pl-5 pr-5 mt-4 font-weight-semibold bg-button"
        @click="router.push('/searchMentors')"
      >
        Найти наставника
      </v-btn>
    </div>
  </v-container>
</template>