<script setup lang="ts">
import { useRouter } from "vue-router"

let buttons = [
  {
    route: '/searchMentors',
    text: 'Найти наставника',
  },
  {
    route: '/settings',
    text: 'Стать наставником',
  },
  {
    route: '/myResponses',
    text: 'Мои отклики',
  },
]
let router = useRouter()
</script>

<template>
  <v-container>
    <v-row class="align-center ma-0 pa-0 mt-5 flex-nowrap">
      <v-avatar size="60" color="blue" />
      <div class="d-flex ml-4 flex-column justify-start">
        <div class="font-weight-bold text-h5">Привет, Василий Пупкин</div>
        <div class="text-body-3 text-text_gray">наставляемый</div>
      </div>
    </v-row>

    <v-row class="mt-10">
      <v-col 
        v-for="button in buttons" 
        :key="button.text" 
        cols="12" md="4" sm="6" xs="12"
      >
        <v-card 
          @click="router.push(button.route)" 
          color="primary"
          class="d-flex pl-8 pr-8 justify-center text-center font-weight-bold text-h6 align-center"
          height="140"
        >
          {{ button.text }}
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>

</style>