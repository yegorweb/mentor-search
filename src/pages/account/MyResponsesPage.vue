<script setup lang="ts">
import { useRouter } from 'vue-router';
import BackButton from '../../components/BackButton.vue';
import MentorEntry from '../../components/entries/MentorEntry.vue';
import { mentorship_entries } from '../../fakeDB/mentorship-entries';

document.title = 'Мои отклики — Ищу наставника'

let router = useRouter()

let mentorship = mentorship_entries.filter(entry => entry.responses.includes('640f4b30cde42820d332b0e9'))
// С уроками и кружками так же
</script>

<template>
  <v-container class="mt-1">
    <BackButton />
    <div class="text-h4 mt-1 font-weight-bold">Мои отклики</div>

    <v-row class="mt-4">
      <v-col 
        v-for="entry in mentorship" 
        :key="entry?.id"
        cols="12" sm="6" xs="12"
      >
        <MentorEntry :entry="entry" />
      </v-col>
    </v-row>

    <div class="d-flex mt-3 align-center ma-auto flex-column justify-center" v-if="mentorship.length==0">
      <div class="text-h4 text-center font-weight-semibold">У вас нет наставников 😱</div>
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