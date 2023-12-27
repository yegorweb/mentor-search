<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, watch, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RolesService from '../../services/RolesService';
import { useAuth } from '../../stores/auth';
import { useEntry } from '../../stores/entry';
import { useSearch } from '../../stores/search';
import { useUser } from '../../stores/user';
import Entry from '../../types/entry.interface';
import { User } from '../../types/user.interface';
import Slave from '../Slave.vue';
import EntryContainer from './EntryContainer.vue';
const showdown = require('showdown')

let router = useRouter()
let route = useRoute()
let auth = useAuth()
let userStore = useUser()
let entryStore = useEntry()

let markdown_converter = new showdown.Converter()

let emit = defineEmits(['delete'])
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
  },
  my_entry: {
    type: Boolean,
    required: false,
    default: false
  }
})

let user = auth.user
let entry = reactive(props.entry as Entry)
let description = markdown_converter.makeHtml(entry.description)

let my_entry = props.my_entry ?? (user && entry.author._id === user._id)
let user_is_admin = user && (
  RolesService.isGlobalAdmin(user.roles) ||
  RolesService.isAdminOfSchool(user.roles, entry.school._id) || 
  RolesService.isAdminOfTown(user.roles, entry.school.town._id) 
)

// Responsing

let responsed = ref(user && entry.responses.includes(user._id) as boolean)
let status = ref<string>(responsed.value ? 'Убрать отклик' : 'Откликнуться')

let response_loading = ref(false)
let delete_loading = ref(false)

async function change_response_state() {
  if (!user)
    return router.push('/login')

  response_loading.value = true

  if (entry.responses.includes(user._id)) {
    await entryStore.cancel_response(entry._id) 
    entry.responses = entry.responses.filter(item => item !== user?._id)
    status.value = 'Откликнуться'
    responsed.value = false
  } 
  else {
    await entryStore.response(entry._id)
    entry.responses.push((user as User)._id)
    status.value = 'Убрать отклик'
    responsed.value = true
  }
 
  response_loading.value = false
}

// Responses list (if my entry)

let showing_responses_status = ref(false)

let responses = ref<User[]>([])
let loading_responses = ref(false)

async function fetchResponses() {
  loading_responses.value = true
  responses.value = await entryStore.getResponses(entry._id)
  loading_responses.value = false
}

if (entryStore.seen_response_id && entry._id === entryStore.seen_response_id && useRoute().path.includes('user')) {
  showing_responses_status.value = true
  entryStore.seen_response_id = null
  fetchResponses()
}

watch(showing_responses_status, (value) => value ? fetchResponses() : null)

// Delete

async function delete_entry() {
  delete_loading.value = true
  await entryStore.delete_entry(entry._id)
  emit('delete', entry._id)
}

// Moderation

let approve_loading = ref(false)
let approve_disabled = ref(false)
let disallow_loading = ref(false)
let disallow_disabled = ref(false)

async function approve() {
  approve_loading.value = true

  await entryStore.verify(entry._id, true)

  approve_disabled.value = true
  disallow_disabled.value = false
  approve_loading.value = false
}
async function disallow() {
  disallow_loading.value = true

  await entryStore.verify(entry._id, false)
 
  disallow_disabled.value = true
  approve_disabled.value = false
  disallow_loading.value = false
}

function setLast() {
  if (!route.path.includes('search'))
    return

  last_entry_id.value = entry._id
  let div = document.getElementById(entry._id)
  if (div)
    delta.value = div.getBoundingClientRect().top
}

let { last_entry_id, delta } = storeToRefs(useSearch())

onMounted(() => {
  if (last_entry_id.value === entry._id && route.path.includes('search')) {
    let div = document.getElementById(entry._id)
    if (!div)
      return
    
    let rect = div.getBoundingClientRect()
    window.scrollTo({ top: rect.y - delta.value })
    last_entry_id.value = undefined
  }
})
</script>

<template>
  <EntryContainer 
    class="justify-space-between" 
    style="position: relative;"
    :id="entry._id"
  >
    <div class="d-flex align-start w-100 justify-start flex-column">
      <!-- Author -->
      <div 
        v-if="!props.hide_user"
        @click="router.push(`/user/${entry.author._id}`); setLast()" 
        class="d-flex flex-row mr-7 mb-2 flex-nowrap align-start-center justify-start cursor-pointer"
      >
        <v-avatar 
          :image="entry.author ? entry.author.avatar_url ?? '' : ''"
          color="blue"
          class="pt-1"
        />

        <div class="d-flex ml-4 mt-auto mb-auto flex-column justify-start">
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
      </div>
      
      <!-- Information -->
      <div 
        style="column-gap: 16px;" 
        class="mr-7"
      >
        <span class="text-h6 font-weight-black" style="line-height: 1.3; word-break: break-all;">
          {{ entry.subject }}
        </span>

        <template v-if="entry.limit">
          &nbsp;&nbsp;
          <span class="text-body font-weight-regular">
            лимит 
            <span style="white-space: nowrap;">
              {{ entry.limit }} чел.
            </span>
          </span>
          
          &nbsp;&nbsp;
          <span 
            class="text-body font-weight-regular" 
            style="white-space: nowrap;"
          >
            осталось {{ entry.limit - entry.responses.length }}
          </span>
        </template>
      </div>

      <div 
        v-html="description" 
        class="mt-2" 
      />
    </div>

    <div class="d-flex mt-5 flex-column justify-start">
      <!-- Location -->
      <div 
        class="mb-2"
        v-if="props.show_location || !user || entry.school._id !== user.school._id"
      >
        <span class="mdi mdi-map-marker text-teal-lighten-1" 
        />&nbsp;<span v-if="!user || entry.school.town._id !== user.school.town._id">{{ entry.school.town.name + ', ' }}</span>{{ entry.school.name }}
      </div>
 
      <!-- Buttons -->
      <div style="row-gap: 6px;" class="d-flex flex-row flex-wrap justify-start align-center">
        <v-btn 
          v-if="!my_entry && !entry.on_moderation"
          @click="change_response_state()"
          :loading="response_loading"
          :disabled="!responsed && entry.limit ? entry.limit - entry.responses.length <= 0 : false"
          size="small"
          variant="tonal" 
          :class="`text-body-2 pl-5 pr-5 mr-3 font-weight-semibold ${responsed ? 'bg-accent' : 'bg-button'}`"
          :ripple="false"
        >
          {{ status }}
        </v-btn>
        
        <v-btn 
          size="small"
          variant="tonal" 
          v-if="my_entry && entry.responses.length > 0"
          class="text-body-2 pl-5 pr-5 mr-3 font-weight-semibold bg-button"
        >
          Посмотреть отклики ({{ entry.responses.length }})

          <v-dialog 
            v-model="showing_responses_status"
            activator="parent"
            scrollable
            class="align-center"
          >
            <v-container>
              <v-card 
                style="min-height: 83vh;" 
                class="rounded-lg w-100 ma-auto"
              >
			          <v-icon 
                  @click="showing_responses_status = false"
                  style="position: absolute; top: 7px; right: 7px;"
                >
                  mdi-close
                </v-icon>

                <div v-if="loading_responses" class="w-100 mt-8 d-flex justify-center">
                  <v-progress-circular indeterminate />
                </div>
			  
                <v-row 
                  v-else
                  class="flex-row flex-wrap pa-8"
                >
                  <v-col 
                    v-for="(client, i) in responses"
                    :key="i"
                    cols="12" lg="6"
                  >
                    <v-row
                      class="align-center h-100 ma-0 response d-flex flex-column flex-sm-row"
                      style="gap: 10px;"
                    >
                      <Slave @click="entryStore.seen_response_id = entry._id" :user="client" />

                      <div 
                        class="d-flex flex-row flex-lg-column ma-auto ma-sm-0 pa-0 align-center align-lg-end" 
                        style="column-gap: 8px; row-gap: 4px;"
                      >
                        <v-btn 
                          size="small"
                          variant="tonal" 
                          class="text-body-2 pl-5 pr-5 font-weight-semibold bg-button"
                        >
                          Заблокировать
                        </v-btn>
                        
                        <v-btn 
                          size="small"
                          variant="tonal" 
                          class="text-body-2 pl-5 pr-5 font-weight-semibold bg-button"
                        >
                          Убрать отклик
                        </v-btn>
                      </div>
                    </v-row>
                  </v-col>
			          </v-row>
              </v-card>
            </v-container>
	        </v-dialog>
        </v-btn>

        <div 
          v-if="entry.responses.length === 0 && my_entry && !entry.on_moderation && entry.moderation_result"
          class="text-body font-weight-regular" 
        >
          Откликов нет
        </div>
      </div>

      <div 
        v-if="user_is_admin && entry.on_moderation" 
        style="row-gap: 6px;" 
        class="d-flex mt-2 flex-row flex-wrap justify-start align-center"
      >
        <v-btn 
          size="small"
          variant="tonal" 
          class="text-body-2 mr-3 pl-5 pr-5 font-weight-semibold bg-light-green-darken-2"
          @click="approve"
          :loading="approve_loading"
          :disabled="approve_disabled"
          :ripple="false"
        >
          Принять
        </v-btn>

        <v-btn 
          size="small"
          variant="tonal" 
          class="text-body-2 pl-5 pr-5 font-weight-semibold bg-red"
          @click="disallow"
          :loading="disallow_loading"
          :disabled="disallow_disabled"
          :ripple="false"
        >
          Отказать
        </v-btn>
      </div>

      <div 
        v-if="my_entry && !entry.on_moderation && !entry.moderation_result" 
        class="mt-2 w-100 text-red"
      >
        Запись отклонена. 
        Исправьте или удалите
      </div>
    </div>

    <!-- Menu -->
    <v-menu 
      v-if="my_entry || user_is_admin"
      location="start top" 
      scroll-strategy="close"
      transition="scroll-y-transition"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ props }">
        <v-icon
          class="pa-4"
          style="position: absolute;right: 12px;top: 12px;"
          icon="mdi-dots-vertical"
          v-bind="props"
        />
      </template>

      <v-list density="compact" class="elevation-0 bg-grey-lighten-2 rounded-lg">
        <v-list-item 
          v-if="my_entry" 
          :to="`/edit/${entry._id}`"
        >
          <template v-slot:prepend>
            <v-icon style="margin-right: 19px;">mdi-pencil</v-icon>
          </template>
          
          Редактировать
        </v-list-item>
        
        <v-list-item 
          @click="delete_entry" 
        >
          <template v-slot:prepend>
            <v-progress-circular 
              v-if="delete_loading"
              indeterminate
              color="primary"
              size="small"
              style="margin-right: 19px;"
            />
            <v-icon v-else style="margin-right: 19px;">mdi-delete</v-icon>
          </template>
          
          Удалить
        </v-list-item>
      </v-list>
    </v-menu>
  </EntryContainer>
</template>

<style lang="scss">
.response {
  border-radius: 13px;
  padding: 11px 19px;
  background: #D6D6D6;
}
</style>
