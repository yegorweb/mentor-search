<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import RolesService from '../../services/RolesService';
import { useAuth } from '../../stores/auth';
import { useEntry } from '../../stores/entry';
import { useUser } from '../../stores/user';
import Entry from '../../types/entry.interface';
import { User } from '../../types/user.interface';
import Slave from '../Slave.vue';
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

let router = useRouter()

let userStore = useUser()

let showing = ref(false)
let responses = ref<string[]>([])
let responses_list = responses.value.map(async (user_id) => (await userStore.get_by_id(user_id)))

let auth = useAuth()
let user = auth.getUser()
let isAuth = auth.getAuthStatus()

let entryStore = useEntry()
let entry = ref<Entry>(props.entry as any)
let response_loading = ref(false)
let delete_loading = ref(false)
let responsed = ref<boolean>(user && entry.value.responses.includes(user._id))

let in_user_own = user && entry.value.author._id === user._id
let user_is_admin = user && (
  RolesService.isAdminOfSchool(user.roles, entry.value.school._id) || 
  RolesService.isAdminOfTown(user.roles, entry.value.town._id) || 
  RolesService.isGlobalAdmin(user.roles)
)

let status = ref<string>(responsed.value ? 'Убрать отклик' : 'Откликнуться')
async function response() {
  if (!user)
    return

  response_loading.value = true

  if (entry.value.responses.includes(user._id)) {
    await entryStore.cancel_response(entry.value._id).then(() => {
      entry.value.responses = entry.value.responses.filter(item => item !== user?._id)
      status.value = 'Откликнуться'
      responsed.value = false
    }).finally(() => response_loading.value = false)
    return
  }
  await entryStore.response(entry.value._id).then(() => {
    entry.value.responses.push((user as User)._id)
    status.value = 'Убрать отклик'
    responsed.value = true
  }).finally(() => response_loading.value = false)
}

async function delete_entry() {
  delete_loading.value = true

  await entryStore.delete_entry(entry.value._id).finally(() => delete_loading.value = false)
}

let approve_loading = ref(false)
let approve_disabled = ref(false)
let disallow_loading = ref(false)
let disallow_disabled = ref(false)

async function approve() {
  approve_loading.value = true

  await entryStore.verify(entry.value._id, true)
  .then(() => {
    approve_disabled.value = true
    disallow_disabled.value = false
  })
  .finally(() => approve_loading.value = false)
}
async function disallow() {
  disallow_loading.value = true

  await entryStore.verify(entry.value._id, false)
  .then(() => {
    disallow_disabled.value = true
    approve_disabled.value = false
  })
  .finally(() => disallow_loading.value = false)
}
</script>

<template>
  <EntryContainer class="justify-space-between" style="position: relative;">
    <div class="d-flex align-start w-100 justify-start flex-column">
      <v-row 
        v-if="!props.hide_user"
        @click="router.push(`/user/${entry.author._id}`)" 
        class="flex-row ma-0 mb-2 pa-0 flex-nowrap align-center justify-start cursor-pointer"
      >
        <v-avatar 
          :image="entry.author.avatar_url"
          color="blue"
        />
        <div class="d-flex ml-4 flex-column justify-start">
          <div
            style="line-height: 1.2;"
            class="font-author font-weight-semibold"
          >
            {{ entry.author.name }}
          </div>
          <div 
            class="text-gray lh-1 text-body-2" 
            v-if="entry.author.ranks.length>0"
          >
            {{ entry.author.ranks?.join(', ') }}
          </div>
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
        v-if="entry.town._id != user?.town?._id || entry.school._id != user?.school?._id || props.show_location"
      >
        <span><v-icon icon="mdi-map-marker" class="mr-1" color="teal-lighten-1"></v-icon></span>
        <span v-if="entry.town._id !== user?.town._id">{{ entry.town.name + ', ' }}
        </span>{{ entry.school.name }}
      </div>
  
      <div style="row-gap: 6px;" class="d-flex flex-row flex-wrap justify-start align-center">
        <v-btn 
          v-if="!in_user_own && !entry.on_moderation"
          @click="response"
          :loading="response_loading"
          :disabled="!isAuth || (entry.limit ? entry.limit - entry.responses.length === 0 : false)"
          size="small"
          variant="tonal" 
          :class="`text-body-2 pl-5 pr-5 mr-3 font-weight-semibold ${responsed ? 'bg-accent' : 'bg-button'}`"
        >
          {{ status }}
        </v-btn>
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
          v-if="in_user_own && entry.responses.length > 0"
          class="text-body-2 pl-5 pr-5 mr-3 font-weight-semibold bg-button"
          @click="responses = entry.responses"
        >
          Посмотреть отклики ({{ entry.responses.length }})

          <v-dialog 
            v-model="showing"
            activator="parent"
            scrollable
          >
            <v-container>
		          <v-card 
                style="min-height: 80vh;" 
                class="rounded-lg w-100"
              >
			          <v-icon @click="showing = false">
                  mdi-close
                </v-icon>
			  
                <v-row class="flex-column">
			  	        <v-col
				  	        cols="12"
		  			        v-for="user in responses_list"
		  			        :key="user._id"
			   	        >
		  			        <Slave :user="user" />
			  	        </v-col>
			          </v-row>
		          </v-card>
            </v-container>
	        </v-dialog>
        </v-btn>

        <div class="text-body font-weight-regular" v-if="entry.responses.length === 0 && in_user_own && !entry.on_moderation && entry.moderation_result">Откликов нет</div>
      </div>

      <div style="row-gap: 6px;" v-if="user_is_admin && entry.on_moderation" class="d-flex mt-2 flex-row flex-wrap justify-start align-center">
        <v-btn 
          size="small"
          variant="tonal" 
          class="text-body-2 mr-3 pl-5 pr-5 font-weight-semibold bg-light-green-darken-2"
          @click="approve"
          :loading="approve_loading"
          :disabled="approve_disabled"
        >Принять</v-btn>

        <v-btn 
          size="small"
          variant="tonal" 
          class="text-body-2 pl-5 pr-5 font-weight-semibold bg-red"
          @click="disallow"
          :loading="disallow_loading"
          :disabled="disallow_disabled"
        >Отказать</v-btn>
      </div>

      <div v-if="in_user_own && !entry.on_moderation && !entry.moderation_result" class="mt-2 w-100 text-red">
        Ваша запись не одобрена администратором. Отредактируйте запись, чтобы отправить отправить на проверку снова
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
        <v-list-item prepend-icon="mdi-pencil" v-if="in_user_own" @click="router.push(`/edit/${entry._id}`)">
          Редактировать
        </v-list-item>
        <v-list-item prepend-icon="mdi-delete" @click="delete_entry" :loading="delete_loading">
          Удалить
        </v-list-item>
      </v-list>
    </v-menu>
  </EntryContainer>
</template>
