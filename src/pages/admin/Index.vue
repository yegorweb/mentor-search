<script setup lang="ts">
import MainTitle from '@/components/MainTitle.vue'
import { useRouter } from 'vue-router'
import RolesService from '../../services/RolesService'
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

// Creating town

let creating_town_status = ref(false)
let creating_town_loading = ref(false)

const { meta:townMeta, handleSubmit:townHandleSubmit } = useForm({
  initialValues: {
    town_name: ''
  },
  validationSchema: {
    town_name(value: string) {
      if (value.trim().length < 2) return 'короткое название'
      return true
    }
  }
})
let town_name = useField('town_name')

const createTown = townHandleSubmit(async (values) => {
  creating_town_loading.value = true

  await useTown().create(values.town_name.trim())
 
  creating_town_loading.value = false
  creating_town_status.value = false
  town_name.value.value = ''
})

// Creating school

let creating_school_status = ref(false)
let creating_school_loading = ref(false)

let administered_towns = await useTown().getAdministeredTowns()

const { meta:schoolMeta, handleSubmit:schoolHandleSubmit } = useForm({
  initialValues: {
    town_id: '',
    school_name: ''
  },
  validationSchema: {
    town_id(value: string) {
      if (!value) return 'выберите город'
      return true
    },
    school_name(value: string) {
      if (value.trim().length < 3) return 'короткое название'
      return true
    }
  }
})
let town_id = useField<string>('town_id')
let school_name = useField<string>('school_name')

const createSchool = schoolHandleSubmit(async (values) => {
  creating_school_loading.value = true

  await useSchool().create(values.school_name.trim(), values.town_id)
  
  creating_school_loading.value = false
  creating_school_status.value = false
  school_name.value.value = ''
})
</script>

<template>
  <v-container>
    <MainTitle>Управление</MainTitle>

    <div class="d-flex flex-column align-start mt-6">
      <v-btn 
        @click="router.push('/admin/moderation')"
        prepend-icon="mdi-check" 
      >
        Модерация
      </v-btn>
        
      <v-btn 
        v-if="RolesService.isTownAdmin(user.roles) || RolesService.isGlobalAdmin(user.roles)"
        prepend-icon="mdi-school"
        class="mt-3"
      >
        Создать школу

        <v-dialog
          v-model="creating_school_status"
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
                v-model="creating_school_status"
              />

              <div class="text-h6 text-center font-weight-bold ma-auto">
                Создать школу
              </div>

              <v-form 
                @submit.prevent="createSchool"
                class="mt-3"
              >
                <v-row 
                  class="flex-row flex-wrap"
                  style="margin: 0 -2px;"
                >
                  <v-col 
                    cols="12" md="6"
                    style="padding: 0 2px;"
                  >
                    <v-autocomplete
                      v-model="town_id.value.value"
                      :error-messages="town_id.errors.value"
                      :items="administered_towns"
                      item-title="name"
                      item-value="_id"
                      auto-select-first
                      label="Город"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>

                  <v-col 
                    cols="12" md="6"
                    style="padding: 0 2px;"
                  >
                    <v-text-field
                      v-model="school_name.value.value"
                      :error-messages="school_name.errorMessage.value"
                      variant="outlined"
                      label="Название"
                      placeholder="Гимназия 8"
                      density="compact"
                    />
                  </v-col>
                </v-row>
                
                <v-card-actions>
                  <v-spacer />

                  <v-btn
                    type="submit"
                    class="bg-accent"
                    :loading="creating_school_loading"
                    :disabled="!schoolMeta.valid"
                  >
                    Создать
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-col>
        </v-dialog>
      </v-btn>

      <v-btn 
        v-if="RolesService.isGlobalAdmin(user.roles)"
        prepend-icon="mdi-town-hall"
        class="mt-3"
      >
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
                Создать город
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
                  density="compact"
                />

                <v-row class="flex-row w-100 ma-0 pa-0">
                  <v-spacer />

                  <v-btn
                    type="submit"
                    class="bg-accent"
                    :loading="creating_town_loading"
                    :disabled="!townMeta.valid"
                  >
                    Создать
                  </v-btn>
                </v-row>
              </v-form>
            </v-card>
          </v-col>
        </v-dialog>
      </v-btn>
    </div>

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
