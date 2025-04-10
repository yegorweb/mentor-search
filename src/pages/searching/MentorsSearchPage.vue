<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'
import MainTitle from '../../components/MainTitle.vue';
import MentorEntry from '../../components/entries/MentorEntry.vue'
import { ref, watch } from 'vue';
import { useAuth } from '../../stores/auth';
import { useSchool } from '../../stores/school';
import { useTown } from '../../stores/town';
import { useEntry } from '../../stores/entry';
import Entry from '../../types/entry.interface';
import _ from 'lodash'
import { storeToRefs } from 'pinia';
import { useSearch } from '../../stores/search'
import School from '../../types/school.interface';

document.title = 'Поиск наставников — Ищу наставника'

let auth = useAuth()
let schoolStore = useSchool()
let entryStore = useEntry()

let { towns } = storeToRefs(useTown())

let { town, school } = storeToRefs(useSearch())

let entries = ref<Entry[]>([])
let loading = ref(false)

async function updateEntries() {
  loading.value = true
  entries.value = school.value ? await entryStore.get('mentor', town.value._id, school.value._id) : []
  loading.value = false
}
updateEntries()

let schools_in_town = ref<School[]>([])
let loading_schools_in_town = ref(true)
async function fetchSchoolsInTown() {
  loading_schools_in_town.value = true
  schools_in_town.value = []
  schools_in_town.value = await schoolStore.get_all_in_town(town.value._id)
  loading_schools_in_town.value = false
}
fetchSchoolsInTown()

watch(town, async (new_value, old_value) => {
  if (_.isEqual(new_value, old_value)) return

  school.value = null
  fetchSchoolsInTown()
})
watch(school, (new_value, old_value) => {
  if (_.isEqual(new_value, old_value)) return

  updateEntries()
})

function onDeleteEntry(_id: string) {
  entries.value = entries.value.filter(entry => entry._id !== _id)
}
</script>

<template>
  <v-container>
    <MainTitle>Поиск наставников</MainTitle>

    <!-- Filter -->
    <v-row class="mt-4" style="margin: -6px;">
      <v-col 
        cols="12" md="4" sm="8" xs="12" 
        style="padding: 6px;"
      >
        <v-autocomplete
          label="Город"
          v-model="town"
          :items="towns"
          :loading="useTown().loading"
          item-title="name"
          auto-select-first
          return-object
          variant="solo"
          hide-details
        />
      </v-col>

      <v-col 
        cols="12" md="4" sm="8" xs="12" 
        style="padding: 6px;"
      >
        <v-autocomplete
          label="Школа"
          v-model="school"
          :items="[{ name: 'Все', _id: 'all' }, ...schools_in_town]"
          item-title="name"
          auto-select-first
          :loading="loading_schools_in_town"
          return-object
          variant="solo"
          hide-details
        />
      </v-col>
    </v-row>

    <div v-if="loading" class="w-100 mt-8 d-flex justify-center">
      <v-progress-circular 
        indeterminate
        color="primary"
      />
    </div>

    <div
      v-else-if="!loading && school && entries.length === 0"
      class="w-100 mt-8 text-center text-h6 font-weight-medium"
    >
      Пусто
    </div>
    
    <div 
      v-else-if="!loading && !school"
      class="w-100 mt-8 text-center text-h6 font-weight-medium"
    >
      Выберите школу
    </div>
    
    <div v-else class="mt-8 entries-container">
      <Suspense>
        <MentorEntry 
          v-for="entry in entries"
          @delete="onDeleteEntry"
          :key="entry._id"
          :entry="entry" 
          :show_location="school?._id === 'all'" 
        />
      </Suspense>
    </div>
  </v-container>
</template>

