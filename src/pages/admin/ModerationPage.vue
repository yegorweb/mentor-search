<script setup>
import MainTitle from '@/components/MainTitle.vue'
import MentorEntry from '../../components/entries/MentorEntry.vue';
import EntryService from '../../services/EntryService'
import { useEntry } from '../../stores/entry';

let entries = await useEntry().get_entries_to_moderation()
console.log(entries)
</script>

<template>
  <v-container>
    <MainTitle>Модерация</MainTitle>

    <div class="mt-6 entries-container">
      <MentorEntry 
        v-for="entry in entries"
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
