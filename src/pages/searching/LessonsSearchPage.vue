<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'
import MainTitle from '../../components/MainTitle.vue';
import MentorEntry from '../../components/entries/MentorEntry.vue'
import { ref, Ref } from 'vue';
import { useAuth } from '../../stores/auth';
import { useSchool } from '../../stores/school';
import { useTown } from '../../stores/town';
import { useEntry } from '../../stores/entry';
import Town from '../../types/town.interface';
import School from '../../types/school.interface';
import Entry from '../../types/entry.interface';

document.title = 'Поиск уроков — Ищу наставника'

let auth = useAuth()
let user = auth.getUser()

function shuffle(arr: any[]){
	var j, temp;
	for(var i = arr.length - 1; i > 0; i--){
		j = Math.floor(Math.random()*(i + 1));
		temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;
	}
	return arr;
}

let townStore = useTown()
let schoolStore = useSchool()
let entryStore = useEntry()

let towns: Town[] = await townStore.get_all() as any
let schools: School[] = await schoolStore.get_all() as any

let town: Ref<Town> = ref(user ? 
  user.town : 
  towns.find(town => town.name === 'Глазов') as any
)

let school = ref(user ? 
  user.school : 
  { name: 'Все', _id: 'all' }
)

let lesson_entries: Ref<Entry[]> = ref(await entryStore.get('lesson', town.value._id, school.value._id) as any)
shuffle(lesson_entries.value)

async function updateEntries() {
  lesson_entries.value = await entryStore.get('lesson', town.value._id, school.value._id) as any
  shuffle(lesson_entries.value)
}

function schools_in_town() {
  return schools.filter(sch => sch.town._id === town.value._id)
}
</script>

<template>
  <v-container>
    <MainTitle>Поиск уроков</MainTitle>

    <!-- Filter -->
    <v-row class="ma-0 pa-0 mt-4" style="gap: 12px;">
      <v-col cols="12" md="4" sm="8" xs="12" class="ml-0 pa-0">
        <v-select
          label="Город"
          v-model="town"
          :items="towns"
          item-title="name"
          return-object
          variant="solo"
          hide-details
        ></v-select>
      </v-col>

      <v-col cols="12" md="4" sm="8" xs="12" class="ma-0 pa-0">
        <v-select
          label="Школа"
          v-model="school"
          :items="[{ name: 'Все', _id: 'all' }, ...schools_in_town()]"
          item-title="name"
          return-object
          @update:model-value="updateEntries"
          variant="solo"
          hide-details
        ></v-select>
      </v-col>
    </v-row>
    
    <div class="mt-8 entries-container">
      <Suspense>
        <MentorEntry 
          v-for="entry in lesson_entries"
          :key="entry._id"
          :entry="entry" 
          :show_location="school._id === 'all'" 
        />
      </Suspense>
    </div>

    <v-col 
      cols="12" sm="6" xs="12" 
      class="text-h6 ma-auto font-weight-medium mt-4 text-center"
      v-if="lesson_entries.length === 0"
    >
      Уроков нет, или вы на всё откликнулись
    </v-col>
  </v-container>
</template>
