<script setup>
import MainTitle from '@/components/MainTitle.vue'
import Slave from '@/components/Slave.vue'
import { useSchool } from '../../stores/school'
import { useUser } from '../../stores/user'
import { useAuth } from '../../stores/auth'
import { onBeforeRouteUpdate } from 'vue-router'

let props = defineProps(['id'])
let id = props.id

let school = await useSchool().get_by_id(id)
let users = (await useUser().get_all_by_school(id)).filter(item => item._id !== useAuth().getUser()._id)

onBeforeRouteUpdate(() => {
  window.location.href = to.path
})
</script>

<template>
  <v-container>
    <MainTitle>{{ school.town.name +', '+ school.name }}</MainTitle>

    <v-row class="mt-8">
      <v-col
        v-for="user in users"
        :key="user._id"
        cols="12" sm="6" md="4" lg="3" xl="2"
      >
        <Slave :user="user" />
      </v-col>
    </v-row>
  </v-container>
</template>
