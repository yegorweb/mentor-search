<script setup lang="ts">
import Achievement from '../../components/Achievement.vue';
import MainTitle from '../../components/MainTitle.vue';
import AchievementsService from '../../services/AchievementsService';
import { useAuth } from '../../stores/auth';
import { User } from '../../types/user.interface';

document.title = 'Мои награды — Ищу наставника'

let user = useAuth().getUser() as User
let achievements = AchievementsService.getActiveAchievements(user.achievements)
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
          cols="12" md="4" sm="8" xs="12" 
          class="ml-0 pa-0"
        >
          <Achievement :achievement="achiev" />
        </v-col>
      </template>
    </v-row>

    <div
      v-if="AchievementsService.getActiveAchievements(achievements).length===0" 
      class="text-h5 text-center text-sm-start font-weight-semibold"
    >
      У вас нет действующих наград, трудитесь больше
    </div>
  </v-container>
</template>
