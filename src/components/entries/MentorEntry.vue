<script setup lang="ts">
import { useRouter } from 'vue-router';
import { users } from '../../fakeDB/users';
import EntryContainer from './EntryContainer.vue';

let props = defineProps({
  entry: {
    type: Object,
    required: true
  }
})

let router = useRouter()
let user = users.find(user => user.id === props.entry.author_id)
</script>

<template>
  <EntryContainer class="justify-space-between">
    <div class="d-flex w-100 justify-start flex-column">
      <v-row 
        @click="router.push('account/?_id=${user.id}')" 
        class="flex-row ma-0 pa-0 flex-nowrap align-center justify-start cursor-pointer"
      >
        <v-avatar 
          :image="user?.avatar_url"
          color="blue"
        />
        <div class="d-flex ml-4 flex-column justify-start">
          <div class="font-author font-weight-semibold">{{ user?.name }}</div>
          <div class="text-gray text-body-2">{{ user?.achievements.join(', ') }}</div>
        </div>
      </v-row>
  
      <div class="text-h6 mt-2 font-weight-black">{{ entry.subject }}</div>
      <div class="mt-1">{{ entry.description }}</div>
    </div>

    <div style="gap: 4px;" class="d-flex mt-4 flex-row flex-wrap justify-start align-center">
      <v-btn 
        size="small"
        variant="tonal" 
        class="text-body-2 pl-5 pr-5 mr-3 font-weight-semibold bg-button"
      >
        Откликнуться
      </v-btn>

      <v-btn 
        size="small"
        variant="tonal" 
        class="text-body-2 pl-5 pr-5 font-weight-semibold bg-button"
      >
        Посмотреть профиль
      </v-btn>
    </div>
  </EntryContainer>
</template>