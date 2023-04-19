<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { schools } from '../../fakeDB/schools';
import EntryService from '../../services/EntryService';
import UserService from '../../services/UserService';
import { useAuth } from '../../stores/auth';
import EntryContainer from './EntryContainer.vue';

let props = defineProps({
  entry: {
    type: Object,
    required: true
  },
  show_location: {
    type: Boolean,
    required: false,
    default: false
  },
  hide_user: {
    type: Boolean,
    required: false,
    default: false
  }
})

let user = useAuth().getUser()
let entry = ref(props.entry)
let loading = ref(false)
let responsed = ref(entry.value.responses.includes(user._id))

let router = useRouter()

let in_user_own = entry.value.author._id == user._id
let user_is_admin = (user.roles.includes('school-admin') && user.administered_schools.includes(entry.value.school._id)) || user.roles.includes('global-admin')

let status = ref(responsed.value ? 'Убрать отклик' : 'Откликнуться')
async function response() {
  loading.value = true
  if (entry.value.responses.includes(user._id)) {
    await EntryService.cancel_response(entry.value._id).then(() => {
      entry.value.responses = entry.value.responses.filter(item => item !== user._id)
      status.value = 'Откликнуться'
      loading.value = false
      responsed.value = false
    })
    return
  }
  await EntryService.response(entry.value._id).then(() => {
    entry.value.responses.push(user._id)
    status.value = 'Убрать отклик'
    loading.value = false
    responsed.value = true
  })
}
</script>

<template>
  <EntryContainer class="justify-space-between" style="position: relative;">
    <div class="d-flex align-start w-100 justify-start flex-column">
      <v-row 
        v-if="!props.hide_user"
        @click="router.push(`user/${entry.author._id}`)" 
        class="flex-row ma-0 mb-2 pa-0 flex-nowrap align-center justify-start cursor-pointer"
      >
        <v-avatar 
          :image="entry.author.avatar_url"
          color="blue"
        />
        <div class="d-flex ml-4 flex-column justify-start">
          <div class="font-author font-weight-semibold">{{ entry.author.name }}</div>
          <div class="text-gray text-body-2">{{ entry.author.ranks?.join(', ') }}</div>
        </div>
      </v-row>
      
      <div style="column-gap: 16px;" class="d-flex align-center flex-row flex-wrap mr-4">
        <div class="text-h6 font-weight-black">{{ entry.subject }}</div>

        <template v-if="entry.limit">
          <div class="text-body font-weight-regular">{{ entry.limit }} чел.</div>
          <div class="text-body font-weight-regular">осталось: {{ entry.limit - entry.responses.length }}</div>
        </template>
      </div>

      <div class="mt-1" v-html="entry.description"></div>
    </div>

    <div class="d-flex mt-5 flex-column justify-start">
      <div 
        class="mb-2"
        v-if="entry.town._id != user.town._id || entry.school._id != user.school._id || props.show_location"
      >
        <span><v-icon icon="mdi-map-marker" class="mr-1" color="teal-lighten-1"></v-icon></span>
        <span v-if="entry.town._id !== user.town._id">{{ entry.town.name + ', ' }}
        </span>{{ entry.school.name }}
      </div>
  
      <div style="row-gap: 6px;" class="d-flex flex-row flex-wrap justify-start align-center">
        <v-btn 
          v-if="!in_user_own"
          @click="response"
          :loading="loading"
          :disabled="!responsed && entry.limit && (entry.limit - entry.responses.length === 0)"
          size="small"
          variant="tonal" 
          :class="`text-body-2 pl-5 pr-5 mr-3 font-weight-semibold ${responsed ? 'bg-accent' : 'bg-button'}`"
        >{{ status }}</v-btn>
        <v-btn 
          size="small"
          :to="`/user/${entry.author._id}`"
          v-if="!props.hide_user"
          variant="tonal" 
          class="text-body-2 pl-5 pr-5 font-weight-semibold bg-button"
        >Посмотреть профиль</v-btn>

        <v-btn 
          size="small"
          variant="tonal" 
          v-if="in_user_own && entry.responses.length !== 0"
          class="text-body-2 pl-5 pr-5 mr-3 font-weight-semibold bg-button"
        >Посмотреть отклики ({{ entry.responses.length }})</v-btn>

        <div class="text-body font-weight-regular" v-if="entry.responses.length === 0 && in_user_own">Откликов нет</div>
      </div>
    </div>

    <v-menu location="start" v-if="in_user_own || user_is_admin">
      <template v-slot:activator="{ props }">
        <v-icon
          class="pa-4"
          style="position: absolute;right: 12px;top: 12px;"
          icon="mdi-dots-vertical"
          v-bind="props"
        />
      </template>

      <v-list density="compact">
        <v-list-item prepend-icon="mdi-pen" @click="router.push('/')">
          Редактировать
        </v-list-item>
        <v-list-item prepend-icon="mdi-delete" @click="router.push('/')">
          Удалить
        </v-list-item>
      </v-list>
    </v-menu>
  </EntryContainer>
</template>