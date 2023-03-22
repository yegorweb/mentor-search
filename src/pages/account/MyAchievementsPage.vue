<script setup lang="ts">
import Achievement from '../../components/Achievement.vue';
import MainTitle from '../../components/MainTitle.vue';
import { users } from '../../fakeDB/users';

document.title = 'Мои награды — Ищу наставника'

let achievements = users.find(user => user.id === '640f4b30cde42820d332b0e9')?.achievements
</script>

<template>
  <v-container>
    <MainTitle>Мои награды</MainTitle>

    <v-row class="ma-0 pa-0 mt-4" style="gap: 12px;">
      <template
        v-for="achiev in achievements"
        :key="achiev.achievement"      
      >
        <v-col 
          v-if="achiev.forever || (!achiev.forever && (achiev.date+achiev.duration) > Date.now())"
          cols="12" md="4" sm="8" xs="12" class="ml-0 pa-0"
        >
          <Achievement :achievement="achiev" />
        </v-col>
      </template>
    </v-row>

    <div
      v-if="achievements?.every(achiev => !achiev.forever) && achievements?.every(achiev => (achiev.date+achiev.duration) < Date.now())" 
      class="text-h5 text-center font-weight-semibold"
    >
      У вас нет действующих наград 😱 Трудитесь больше
    </div>
  </v-container>
</template>