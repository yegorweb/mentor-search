<script setup lang="ts">
import { ref, Ref, watch, computed } from 'vue';
import RolesService from '../services/RolesService';
import { useAuth } from '../stores/auth';
import { useSchool } from '../stores/school';
import { useTown } from '../stores/town';
import School from '../types/school.interface';
import Town from '../types/town.interface';
import CloseButton from './CloseButton.vue';
import _ from 'lodash'
import { useField, useForm } from 'vee-validate';
import { User } from '../types/user.interface';
import { storeToRefs } from 'pinia';
import { useUser } from '../stores/user';

let auth = useAuth()
let I: Ref<User> = storeToRefs(auth).user as any

let { administered_schools } = storeToRefs(useSchool())
let { administered_towns } = storeToRefs(useTown())

let props = defineProps({
  roles: {
    type: Array<string>,
    default: [],
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
})

let emit = defineEmits(['update:modelValue', 'update:roles', 'close'])

let roles = computed<string[]>({
  get(): string[] {
    return props.roles
  },
  set(value) {
    emit('update:roles', value)
  }
})

type TabItem = 'main' | 'choise' | 'deletion' | 'school_admin' | 'town_admin' | 'global_admin'
let tab = ref<TabItem>('main')

let user_roles = ref<{ role: string; name: string; have_access: boolean }[]>([])
async function fetchUserRoles() {
  user_roles.value = await useUser().getRoles(props.user_id)
}
fetchUserRoles()
let users_schools = RolesService.getSchoolIdsFromRoles(roles.value)
let users_towns = RolesService.getTownIdsFromRoles(roles.value)
let user_is_global_admin = RolesService.isGlobalAdmin(roles.value)

let my_schools: School[] = administered_schools.value
let my_towns: Town[] = administered_towns.value
let im_global_admin: boolean = RolesService.isGlobalAdmin(I.value.roles)
let im_owner: boolean = RolesService.isOwner(I.value.roles)

let schools_to_add = my_schools.filter(school => !users_schools.includes(school._id))
let towns_to_add = my_towns.filter(town => !users_towns.includes(town._id))

let deletion_role = ref<string>()
let name_of_deletion_role = ref<string>()

function onDeleteRole(role: string, role_name: string) {
  tab.value = 'deletion'
  deletion_role.value = role
  name_of_deletion_role.value = role_name
}
function deleteRole() {
  roles.value = roles.value.filter(role => role !== deletion_role.value)
}

let { meta:school_admin_meta, handleSubmit:schoolAdminSubmit, handleReset:schoolAdminReset } = useForm({
  initialValues: {
    school_for_admin: schools_to_add.length === 1 ? schools_to_add[0] : null,
    town: null
  },
  validationSchema: {
    school_for_admin(value: School | null) {
      return !!value
    },
    town(value: Town | null) {
      return !!value
    }
  }
})

let school_for_admin = useField<School | null>('school_for_admin')
let town = useField<Town | null>('town')
town.value.value = school_for_admin.value.value ? school_for_admin.value.value.town : my_towns.length === 1 ? my_towns[0] : null

let towns: Town[] = []
if (I && RolesService.isGlobalAdmin(I.value.roles)) {
  towns = useTown().towns
} else {
  towns = [...new Set([...towns_to_add, ...my_schools.map(school => school.town)])]
}
let schools_in_town = ref(town.value.value ? schools_to_add.filter(school => school.town._id === (town.value.value as Town)._id) : [])

watch(town.value, (new_value, old_value) => {
  if (_.isEqual(new_value, old_value)) return

  school_for_admin.value.value = null
  schools_in_town.value = new_value ? schools_to_add.filter(school => school.town._id === new_value._id) : []
})

let addSchoolAdminRole = schoolAdminSubmit(values => {
  roles.value = RolesService.getRolesWithSchool(roles.value, (values.school_for_admin as School)._id)
  tab.value = 'main'
})

let { meta:town_admin_meta, handleSubmit:townAdminSubmit, handleReset:townAdminReset } = useForm({
  initialValues: {
    town_for_admin: towns_to_add.length === 1 ? towns_to_add[0] : null
  },
  validationSchema: {
    town_for_admin(value: Town | null) {
      return !!value
    }
  }
})

let town_for_admin = useField<Town | null>('town_for_admin')

let addTownAdminRole = townAdminSubmit(values => {
  roles.value = RolesService.getRolesWithTown(roles.value, (values.town_for_admin as Town)._id)
  tab.value = 'main'
})

function addGlobalAdminRole() {
  roles.value = RolesService.getRolesWithGlobalAdmin(roles.value)
}

let page = ref('Управление ролями')
watch(tab, value => {
  if (value === 'main')
    page.value = 'Управление ролями'
  else if (value === 'choise')
    page.value = 'Добавить роль'
  else if (value === 'deletion')
    page.value = 'Подтверждение'
  else if (value === 'school_admin')
    page.value = 'Админ школы'
  else if (value === 'town_admin')
    page.value = 'Админ города'
  else if (value === 'global_admin')
    page.value = 'Глобальный админ'
})
</script>

<template>
    <v-container class="d-flex justify-center">
      <v-col 
        cols="12" md="8" lg="6"
        class="pa-0"
      >
        <v-card 
          class="rounded-lg pa-3 pt-4" 
          style="position: relative; min-height: 60vh;"
        >
          <CloseButton @click="emit('close')" />

          <div style="font-size: 18px;" class="font-weight-bold w-100 text-center">
            {{ page }}
          </div>
    
          <v-window v-model="tab" class="pa-2">
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
                  v-for="role, index in user_roles"
                  :key="index"
                  cols="12"
                >
                <v-row>
                  <v-col cols="1">
                    <v-btn
                      v-if="role.have_access"
                      @click="onDeleteRole(role.role, role.name)"
                      variant="text"
                      icon="mdi-minus"
                    />
                  </v-col>

                  <v-col 
                    cols="11"
                    class="d-flex align-center"
                  >
                    {{ role.name }}
                  </v-col>
                </v-row>
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
                    @click="deleteRole"
                    color="red"
                  >
                    Удалить
                  </v-btn>
                </v-col>
              </v-row>          
            </v-window-item>
    
            <v-window-item value="choise">
              <div class="d-flex flex-column">
                <v-card 
                  v-if="schools_to_add.length || towns.length || im_global_admin"
                  @click="tab = 'school_admin'"
                  prepend-icon="mdi-school"
                  append-icon="mdi-chevron-right"
                >
                  <template v-slot:title>
                    <div class="ml-2">Администратора школы</div>
                  </template>
                </v-card>

                <v-card 
                  v-if="towns_to_add.length || im_global_admin"
                  @click="tab = 'town_admin'"
                  prepend-icon="mdi-town-hall"
                  append-icon="mdi-chevron-right"
                  class="mt-3"
                >
                  <template v-slot:title>
                    <div class="ml-2">Администратора города</div>
                  </template>
                </v-card>

                <v-card 
                  v-if="im_owner && !user_is_global_admin"
                  @click="tab = 'global_admin'"
                  prepend-icon="mdi-earth"
                  append-icon="mdi-chevron-right"
                  class="mt-3"
                >
                  <template v-slot:title>
                    <div class="ml-2">Глобального админа</div>
                  </template>
                </v-card>
              </div>

              <v-btn @click="tab = 'main'" variant="text" class="mt-3">
                Назад
              </v-btn>
            </v-window-item>
    
            <v-window-item value="town_admin">
              <v-form @submit.prevent="addTownAdminRole">
                <v-autocomplete
                  label="Город"
                  v-model="town_for_admin.value.value"
                  :items="towns_to_add"
                  item-title="name"
                  hide-details
                  auto-select-first
                  return-object
                  variant="solo"
                />

                <v-card-actions class="mt-3">
                  <v-spacer />

                  <v-row>
                    <v-col cols="auto">
                      <v-btn @click="tab = 'choise'; townAdminReset()" class="pr-3 pl-3">
                        Назад
                      </v-btn>
                    </v-col>

                    <v-col cols="auto">
                      <v-btn 
                        type="submit"
                        :class="`pr-3 pl-3 ${town_admin_meta.valid ? 'bg-accent' : ''}`"
                        :disabled="!town_admin_meta.valid"
                      >
                        Добавить
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-form>
            </v-window-item>
    
            <v-window-item value="school_admin">
              <v-form @submit.prevent="addSchoolAdminRole">
                <v-autocomplete
                  label="Город"
                  v-model="town.value.value"
                  :items="towns"
                  item-title="name"
                  auto-select-first
                  hide-details
                  return-object
                  variant="solo"
                />

                <v-autocomplete
                  label="Школа"
                  v-model="school_for_admin.value.value"
                  hide-details
                  :items="schools_in_town"
                  item-title="name"
                  auto-select-first
                  return-object
                  variant="solo"
                  class="mt-3"
                />

                <v-card-actions class="mt-3">
                  <v-spacer />

                  <v-row>
                    <v-col cols="auto">
                      <v-btn @click="tab = 'choise'; townAdminReset()" class="pl-3 pr-3">
                        назад
                      </v-btn>
                    </v-col>

                    <v-col cols="auto">
                      <v-btn 
                        type="submit"
                        :class="`pr-3 pl-3 ${school_admin_meta.valid ? 'bg-accent' : ''}`"
                        :disabled="!school_admin_meta.valid"
                      >
                        Добавить
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-form>              
            </v-window-item>
    
            <v-window-item value="global_admin">
              <v-form @submit.prevent="addGlobalAdminRole">
                <div class="w-100 text-center text-h5">
                  Точно хотите назначить пользователя глобальным администратором?
                </div>

                <v-card-actions>
                  <v-spacer />

                  <v-row>
                    <v-col>
                      <v-btn @click="tab = 'choise'">
                        Назад
                      </v-btn>
                    </v-col>

                    <v-col>
                      <v-btn 
                        type="submit"
                        color="accent"
                      >
                        Назначить
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-form>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-container>
</template>
