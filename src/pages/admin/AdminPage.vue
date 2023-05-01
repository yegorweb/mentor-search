<script setup>
import MainTitle from '@/components/MainTitle.vue'
import { useRouter } from 'vue-router'
import SchoolService from '../../services/SchoolService'
import { useAuth } from '../../stores/auth'

let router = useRouter()

let user = useAuth().getUser()

let schools = user.roles.includes('global-admin') ? (await SchoolService.get_all()).data : user.administered_schools.map(async item => (await SchoolService.get_by_id(item)).data)
</script>

<template>
  <v-container>
    <MainTitle>Управление</MainTitle>

    <v-btn 
      prepend-icon="mdi-check" 
      @click="router.push('/admin/moderation')"
      class="mt-6"
    >Модерация</v-btn>

    <div class="text-h5 mb-4 font-weight-bold mt-8">Ваши школы</div>
    <v-row class="mt-1 ma-0 pa-0">
      <v-col
        v-for="school in schools"
        :key="school._id"
        cols="12" md="4" sm="6"
        class="ma-0 pa-0"
      >
        <v-card 
          @click="router.push(`/admin/school/${school._id}`)"
          class="text-center align-center pt-4 pb-4"
        >
          {{ school.town.name }}, {{ school.name }}
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>