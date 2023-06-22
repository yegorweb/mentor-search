<script setup>
import MainTitle from '@/components/MainTitle.vue'
import { useRouter } from 'vue-router'
import RolesService from '../../services/RolesService'
import SchoolService from '../../services/SchoolService'
import { useAuth } from '../../stores/auth'
import { useSchool } from '../../stores/school'
import { useTown } from '../../stores/town'
import { ref } from 'vue'

let router = useRouter()

let user = useAuth().getUser()
let schools = await useSchool().get_administered_schools()

let creating_town_status = ref(false)
let town_name = ref('')

async function createTown() {
  await useTown().create(town_name.value)
  town_name.value = ''
}
</script>

<template>
  <v-container>
    <MainTitle>Управление</MainTitle>

    <v-btn 
      prepend-icon="mdi-check" 
      @click="router.push('/admin/moderation')"
      class="mt-6"
    >Модерация</v-btn>

    <template v-if="RolesService.isGlobalAdmin(user.roles)">
      <v-btn>
        Создать город

        <v-dialog
          v-model="creating_town_status"
          activator="parent"
        >
          <v-card>
            <v-container>
              <v-text-field 
                v-model="town_name"
                variant="outlined"
                label="Название"
              />

              <v-row class="flex-row">
                <v-spacer />

                <v-btn
                  @click="creating_town_status = false"
                >Закрыть</v-btn>
                <v-btn
                  class="bg-accent"
                  @click="createTown"
                >
                  Создать
                </v-btn>
              </v-row>
            </v-container>
          </v-card>
        </v-dialog>
      </v-btn>
    </template>

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
