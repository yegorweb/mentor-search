<script setup lang="ts">
import MainTitle from '@/components/MainTitle.vue'
import Slave from '@/components/Slave.vue'
import { useSchool } from '../../stores/school'
import { useUser } from '../../stores/user'
import { useAuth } from '../../stores/auth'
import { onBeforeRouteUpdate } from 'vue-router'
import { User } from '../../types/user.interface'
import School from '../../types/school.interface'
import { ref, Ref } from 'vue'
import { storeToRefs } from 'pinia'

let props = defineProps(['id'])
let id = props.id

let user: Ref<User> = storeToRefs(useAuth()).user as any

let school = await useSchool().get_by_id(id) as School

let loading = ref(false)
let users = ref<User[]>([])

async function fetchUsers() {
  loading.value = true
  users.value = (await useUser().get_all_by_school(id)).filter(item => item._id !== user.value._id)
  loading.value = false
}
fetchUsers()

onBeforeRouteUpdate((to) => {
  window.location.href = to.path
})
</script>

<template>
  <v-container>
    <MainTitle>{{ school.town.name + ', ' + school.name }}</MainTitle>

    <div v-if="loading" class="d-flex mt-4 justify-center">
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </div>

    <h3 class="mt-4 font-weight-regular" v-else-if="!loading && !users.length">
      Нет учеников
    </h3>

    <v-row v-else class="mt-4">
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
