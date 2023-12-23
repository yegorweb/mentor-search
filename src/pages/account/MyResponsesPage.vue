<script setup lang="ts">
import { ref } from 'vue';
import MentorEntry from '../../components/entries/MentorEntry.vue';
import MainTitle from '../../components/MainTitle.vue';
import { useUser } from '../../stores/user';
import Entry from '../../types/entry.interface';

document.title = 'Мои отклики — Ищу наставника'

let userStore = useUser()

let entries = ref<Entry[]>([])
let loading = ref(false)

async function fetchEntries() {
  loading.value = true
  entries.value = await userStore.get_my_responses()
  loading.value = false 
}
fetchEntries()

function onDeleteEntry(_id: string) {
  entries.value = entries.value.filter(entry => entry._id !== _id)
}
</script>

<template>
  <v-container>
    <MainTitle class="pb-3">
      Мои отклики
    </MainTitle>

    <div v-if="loading" class="d-flex mt-4 justify-center">
      <v-progress-circular 
        indeterminate
        color="primary"
      />
    </div>

    <div 
      v-else-if="!loading && entries && entries.length"
      class="entries-container pt-4 pb-4"
    >
      <MentorEntry 
        v-for="entry in entries"
        @delete="onDeleteEntry"
        :key="entry._id"
        :entry="entry" 
      />
    </div>

    <div 
      v-else
      class="d-flex mt-3 flex-column align-center align-sm-start" 
    >
      <div class="text-h5 w-100 text-center font-weight-semibold">
        У вас нет откликов 😱
      </div>
      
      <v-btn 
        size="small"
        variant="tonal" 
        class="text-body-2 pl-5 pr-5 ma-auto mt-4 font-weight-semibold bg-button"
        to="/search-mentors"
      >
        Найти наставника
      </v-btn>
    </div>
  </v-container>
</template>
