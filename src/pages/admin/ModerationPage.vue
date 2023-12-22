<script setup lang="ts">
import MainTitle from '@/components/MainTitle.vue'
import { ref } from 'vue';
import MentorEntry from '../../components/entries/MentorEntry.vue';
import { useEntry } from '../../stores/entry';

let entries = ref(await useEntry().get_entries_to_moderation())

function onDeleteEntry(_id: string) {
  entries.value = entries.value.filter(entry => entry._id !== _id)
}
</script>

<template>
  <v-container>
    <MainTitle>Модерация</MainTitle>

    <div class="mt-6 entries-container">
      <MentorEntry 
        v-for="entry in entries"
        @delete="onDeleteEntry"
        :key="entry._id"
        show_location 
        :entry="entry" 
      />
    </div>

    <div 
      class="text-h6 font-weight-medium"
      v-if="entries.length === 0"
    >
      Все записи проверены
    </div>
  </v-container>
</template>
