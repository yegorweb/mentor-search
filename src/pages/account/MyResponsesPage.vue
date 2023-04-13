<script setup lang="ts">
import { useRouter } from 'vue-router';
import MentorEntry from '../../components/entries/MentorEntry.vue';
import MainTitle from '../../components/MainTitle.vue';
import UserService from '../../services/UserService';

document.title = 'Мои отклики — Ищу наставника'

let router = useRouter()

let mentorship = (await UserService.get_my_responses()).data
</script>

<template>
  <v-container>
    <MainTitle>Мои отклики</MainTitle>

    <v-row class="mt-4">
      <v-col 
        v-for="entry in mentorship" 
        :key="entry?.id"
        cols="12" sm="6" xs="12"
      >
        <MentorEntry :entry="entry" />
      </v-col>
    </v-row>

    <div class="d-flex mt-3 align-center ma-auto flex-column justify-center" v-if="mentorship.length===0">
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