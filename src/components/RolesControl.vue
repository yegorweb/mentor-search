<script setup lang="ts">
import { ref, watch } from 'vue';
import RolesService from '../services/RolesService';
import { useAuth } from '../stores/auth';
import { useSchool } from '../stores/school';
import { useTown } from '../stores/town';
import School from '../types/school.interface';
import Town from '../types/town.interface';
import { User } from '../types/user.interface';
import CloseButton from './CloseButton.vue';
import Role from './Role.vue';

let auth = useAuth()
let I = auth.user

let props = defineProps<{
  modelValue: boolean,
  roles: string[]
}>()

let emit = defineEmits(['update:modelValue', 'update:roles'])

let state = ref<boolean>(props.modelValue)
let roles = ref<string[]>(props.roles.filter(role => role !== 'mentor' && role !== 'student'))

watch(state, (value) => {
  emit('update:modelValue', state.value)
  tab.value = 'main'
})
watch(roles, () => emit('update:roles', roles.value))

type TabItem = 'main' | 'choise' | 'deletion' | 'school_admin' | 'town_admin' | 'global_admin'
let tab = ref<TabItem>('main')

// let users_schools = RolesService.getSchoolIdsFromRoles(roles.value)
// let users_towns = RolesService.getTownIdsFromRoles(roles.value)
// let user_is_global_admin = RolesService.isGlobalAdmin(roles.value)

let my_schools: School[] = []
let my_towns: Town[] = []
let im_global_admin: boolean = false
let im_owner: boolean = false

if (I) {
  my_schools = await useSchool().get_administered_schools()
  my_towns = await useTown().getAdministeredTowns()
  im_global_admin = RolesService.isGlobalAdmin(I.roles)
  im_owner = RolesService.isOwner(I.roles)
}

let deletion_role = ref<string>()
let name_of_deletion_role = ref<string>()

function onDeleteRole(role: string, role_name: string) {
  tab.value = 'deletion'
  deletion_role.value = role
  name_of_deletion_role.value = role_name
}

let town = ref<Town>(my_towns[0])

let school = ref<School | null>(my_schools[0])

let schools_in_town = ref(await schoolStore.get_all_in_town(town.value._id))

watch(town, async (new_value, old_value) => {
  if (_.isEqual(new_value, old_value)) return

  school.value = null
  schools_in_town.value = await schoolStore.get_all_in_town(town.value._id)
})
watch(school, (new_value, old_value) => {
  if (_.isEqual(new_value, old_value)) return

  updateEntries()
})
</script>

<template>
  <v-container>
    <MainTitle>Поиск уроков</MainTitle>

    <!-- Filter -->
    <v-row class="mt-4" style="margin: -6px;">
      <v-col 
        cols="12" md="4" sm="8" xs="12" 
        style="padding: 6px;"
      >
        <v-autocomplete
          label="Город"
          v-model="town"
          :items="towns"
          item-title="name"
          auto-select-first
          return-object
          variant="solo"
          hide-details
        />
      </v-col>

      <v-col 
        cols="12" md="4" sm="8" xs="12" 
        style="padding: 6px;"
      >
        <v-autocomplete
          label="Школа"
          v-model="school"
          :items="[{ name: 'Все', _id: 'all' }, ...schools_in_town]"
          item-title="name"
          auto-select-first
          return-object
          variant="solo"
          hide-details
        />
      </v-col>
    </v-row>

</script>

<template>
  <v-dialog 
    v-model="state"
    activator="parent"
  >    
    <v-container class="d-flex justify-center">
      <v-col 
        cols="12" md="8" lg="6"
        class="pa-0"
      >
        <v-card 
          class="rounded-lg pa-3" 
          style="position: relative; min-height: 60vh;"
        >
          <CloseButton v-model="state" />

          <div class="font-weight-bold w-100 text-center">
            Управление ролями
          </div>
    
          <v-window v-model="tab">
            <v-window-item value="main">
              <v-row class="flex-column">
                <v-col cols="12">
                  <v-btn
                    @click="tab = 'choise'"
                    variant="text"
                    prepend-icon="mdi-plus"
                    class="text-blue-darken-1"
                  >
                    Добавить роль
                  </v-btn>
                </v-col>
    
                <v-col 
                  v-for="role, index in roles"
                  :key="index"
                  cols="12"
                >
                  <Role 
                    v-model="roles[index]" 
                    @delete="onDeleteRole"
                  />
                </v-col>
              </v-row>
            </v-window-item>
    
            <v-window-item value="deletion">
              <div class="text-center w-100">
                Вы точно хотите удалить роль «{{ name_of_deletion_role }}»?
              </div>
      
              <v-row class="flex-row justify-center mt-3">
                <v-col cols="auto">
                  <v-btn
                    @click="tab = 'main'"
                    variant="outlined"
                  >
                    Назад
                  </v-btn>
                </v-col>
      
                <v-col cols="auto">
                  <v-btn
                    @click="roles = roles.filter(role => role !== deletion_role)"
                    color="accent"
                  >
                    Хочу
                  </v-btn>
                </v-col>
              </v-row>          
            </v-window-item>
    
            <v-window-item value="choise">
              <v-row class="flex-column">
                <v-col cols="12" v-if="my_schools.length || im_global_admin">
                  <v-card 
                    @click="tab = 'school_admin'"
                    prepend-icon="mdi-school"
                    append-icon="mdi-chevron-right"
                  >
                    <template v-slot:title>                      
                      Админ школы
                    </template>
                  </v-card>
                </v-col>

                <v-col cols="12" v-if="my_towns.length || im_global_admin">
                  <v-card 
                    @click="tab = 'town_admin'"
                    prepend-icon="mdi-town-hall"
                    append-icon="mdi-chevron-right"
                  >
                    <template v-slot:title>
                      Админ города
                    </template>
                  </v-card>
                </v-col>

                <v-col cols="12" v-if="im_owner">
                  <v-card 
                    @click="tab = 'global_admin'"
                    prepend-icon="mdi-earth"
                    append-icon="mdi-chevron-right"
                  >
                    <template v-slot:title>
                      Глобальный админ                      
                    </template>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>
    
            <v-window-item value="school_admin">
              
            </v-window-item>
    
            <v-window-item value="town_admin">
              
            </v-window-item>
    
            <v-window-item value="global_admin">
    
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-container>
  </v-dialog>
</template>