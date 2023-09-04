<script setup lang="ts">
import { ref } from 'vue';
import RolesService from '../services/RolesService';
import { useSchool } from '../stores/school';
import { useTown } from '../stores/town';
import { useUser } from '../stores/user';

let props = defineProps<{
  modelValue: string
}>()
let role = props.modelValue
let emit = defineEmits(['delete'])

let status = ref('')

async function matchName() {
  if (RolesService.getSchoolIdsFromRoles([role]).length) {
    let school = await useSchool().get_by_id(RolesService.getSchoolIdFromRole(role))
    return status.value = `Админ ОУ «${school?.name}»`
  } 
  else if (RolesService.getTownIdsFromRoles([role]).length) {
    let town = await useTown().get_by_id(RolesService.getTownIdFromRole(role))
    return status.value = `Админ города ${town?.name}`
  }
  else if (RolesService.isGlobalAdmin([role])) 
    return status.value = 'Глобальный администратор'
  else if (RolesService.isOwner([role]))
    return status.value = 'Boss of the GYM'
}
matchName()

let IHaveAccess = await useUser().haveIAccessToRole(role)
</script>

<template>
  <v-row>
    <v-col cols="1">
      <v-btn
        v-if="IHaveAccess"
        @click="emit('delete', role, status)"
        variant="text"
        icon="mdi-minus"
      />
    </v-col>

    <v-col 
      cols="11"
      class="d-flex align-center"
    >
      {{ status }}
    </v-col>
  </v-row>
</template>