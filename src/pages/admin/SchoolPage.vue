<script setup>
import MainTitle from '@/components/MainTitle.vue'
import SchoolService from '../../services/SchoolService'
import UserService from '../../services/UserService'
import Slave from '@/components/Slave.vue'

let props = defineProps(['id'])

let id = props.id

let school = (await SchoolService.get_by_id(id)).data

let users = (await UserService.get_all_by_school(id)).data
</script>

<template>
  <v-container>
    <MainTitle>{{ school.town.name }}, {{ school.name }}</MainTitle>

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