<script setup>
import MainTitle from '@/components/MainTitle.vue'
import MentorEntry from '../../components/entries/MentorEntry.vue';
import EntryService from '../../services/EntryService'
import { useEntry } from '../../stores/entry';

let entries = await useEntry().get_entries_to_moderation()
</script>

<template>
  <v-container>
    <MainTitle>Модерация</MainTitle>

    <v-row class="mt-4">
      <v-col 
        v-for="entry in entries"
        :key="entry._id"
        cols="12" sm="6" xs="12"
      >
        <MentorEntry show_location :entry="entry" />
      </v-col>

      <v-col 
        class="text-h6 font-weight-medium"
        v-if="entries.length === 0"
      >Все записи проверены</v-col>
    </v-row>
  </v-container>
</template>