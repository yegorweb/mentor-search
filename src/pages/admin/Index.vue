<script setup lang="ts">
import MainTitle from '@/components/MainTitle.vue'
import { useRouter } from 'vue-router'
import RolesService from '../../services/RolesService'
import SchoolService from '../../services/SchoolService'
import { useAuth } from '../../stores/auth'
import { useSchool } from '../../stores/school'
import { useTown } from '../../stores/town'
import { ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import CloseButton from '@/components/CloseButton.vue'
import { User } from '../../types/user.interface'

let router = useRouter()

let user = useAuth().user as User
let schools = await useSchool().get_administered_schools()

let creating_town_status = ref(false)
let creating_town_loading = ref(false)

const { meta, handleSubmit } = useForm({
  initialValues: {
    town_name: ''
  },
  validationSchema: {
    town_name(value: string) {
      if (value.length < 2) return 'короткое название'
      return true
    }
  }
})
let town_name = useField('town_name')

const createTown = handleSubmit(async (values) => {
  creating_town_loading.value = true

  await useTown().create(values.town_name).then(() =>  {
    town_name.value.value = ''
    creating_town_status.value = false
  }).finally(() => {
    creating_town_loading.value = false
  })
})
</script>

<template>
  <v-container>
    <MainTitle>Управление</MainTitle>

    <v-row class="flex-column">
      <v-col>
        <v-btn 
          prepend-icon="mdi-check" 
          @click="router.push('/admin/moderation')"
          class="mt-6"
        >
          Модерация
        </v-btn>
      </v-col>

      <template v-if="RolesService.isGlobalAdmin(user.roles)">
        <v-col>
          <v-btn>
            Создать город

            <v-dialog
              v-model="creating_town_status"
              activator="parent"
            >
              <v-col 
                cols="12" sm="8" md="6" lg="5" xl="4"
                class="ma-auto ma-0 pa-0"
              >
                <v-card 
                  class="pa-5 pt-4 pb-4 rounded-lg"
                  style="position: relative;"
                >
                  <CloseButton
                    v-model="creating_town_status"
                  />

                  <div class="text-h6 text-center font-weight-bold ma-auto">
                    Создание города
                  </div>

                  <v-form 
                    @submit.prevent="createTown"
                    class="mt-3"
                  >
                    <v-text-field
                      v-model="town_name.value.value"
                      :error-messages="town_name.errorMessage.value"
                      variant="outlined"
                      label="Название"
                      placeholder="Глазов"
                      density="comfortable"
                    />

                    <v-row class="flex-row w-100 ma-0 pa-0">
                      <v-spacer />

                      <v-btn
                        type="submit"
                        class="bg-accent"
                        @click="createTown"
                        :loading="creating_town_loading"
                        :disabled="!meta.valid"
                      >
                        Создать
                      </v-btn>
                    </v-row>
                  </v-form>
                </v-card>
              </v-col>
            </v-dialog>
          </v-btn>
        </v-col>
      </template>
    </v-row>

    <div class="text-h5 mb-4 font-weight-bold mt-8">
      Ваши школы
    </div>
    
    <v-row class="mt-1">
      <v-col
        v-for="school in schools"
        :key="school._id"
        cols="12" md="4" sm="6"
      >
        <v-card 
          @click="router.push(`/admin/school/${school._id}`)"
          class="text-center align-center pa-4"
        >
          {{ school.town.name }}, {{ school.name }}
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
