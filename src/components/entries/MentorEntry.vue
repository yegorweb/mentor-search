<script setup lang="ts">
import { useRouter } from 'vue-router';
import { schools } from '../../fakeDB/schools';
import { towns } from '../../fakeDB/towns';
import { users } from '../../fakeDB/users';
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
  }
})

let router = useRouter()
let user = users.find(user => user.id === props.entry.author_id)
</script>

<template>
  <EntryContainer class="justify-space-between" style="position: relative;">
    <div class="d-flex align-start w-100 justify-start flex-column">
      <v-row 
        @click="router.push(`account?id=${entry.author_id}`)" 
        class="flex-row ma-0 pa-0 flex-nowrap align-center justify-start cursor-pointer"
      >
        <v-avatar 
          :image="user?.avatar_url"
          color="blue"
        />
        <div class="d-flex ml-4 flex-column justify-start">
          <div class="font-author font-weight-semibold">{{ user?.name }}</div>
          <div class="text-gray text-body-2">{{ user?.ranks.join(', ') }}</div>
        </div>
      </v-row>
  
      <div class="text-h6 mt-2 font-weight-black">{{ entry.subject }}</div>
      <div class="mt-1">{{ entry.description }}</div>
    </div>

    <div class="d-flex mt-4 flex-column justify-start">
      <div 
        v-if="entry.town_id != '640f4ac9145a0da782eb1a95' || entry.school_id != '640f4af989029a9d95db4b19' || props.show_location"
      >
        <span><v-icon icon="mdi-map-marker" color="teal-lighten-1"></v-icon></span>
        <span v-if="entry.town_id != '640f4ac9145a0da782eb1a95'">{{ 
          towns.find(town => town.id === entry.town_id)?.name + ', ' }}
        </span>
        {{ schools.find(sch => sch.id === entry.school_id)?.name }}
      </div>
  
      <div style="row-gap: 6px;" class="d-flex mt-2 flex-row flex-wrap justify-start align-center">
        <v-btn 
          size="small"
          variant="tonal" 
          class="text-body-2 pl-5 pr-5 mr-3 font-weight-semibold bg-button"
        >Откликнуться</v-btn>
        <v-btn 
          size="small"
          :to="`account?id=${entry.author_id}`"
          variant="tonal" 
          class="text-body-2 pl-5 pr-5 font-weight-semibold bg-button"
        >Посмотреть профиль</v-btn>
      </div>
    </div>

    <v-menu location="start">
      <template v-slot:activator="{ props }">
        <v-icon
          class="pa-4"
          style="position: absolute;right: 12px;top: 12px;"
          icon="mdi-dots-vertical"
          v-bind="props"
        />
      </template>

      <v-list density="compact" nav :lines="false">
        <v-list-item prepend-icon="mdi-pen" rounded>
          Редактировать
        </v-list-item>
        <v-list-item prepend-icon="mdi-delete" rounded>
          Удалить
        </v-list-item>
      </v-list>
    </v-menu>
  </EntryContainer>
</template>