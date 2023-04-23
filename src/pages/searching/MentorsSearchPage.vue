<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'
import MainTitle from '../../components/MainTitle.vue';
import MentorEntry from '../../components/entries/MentorEntry.vue'
import { ref } from 'vue';
import { useAuth } from '../../stores/auth';
import TownService from '../../services/TownService';
import SchoolService from '../../services/SchoolService';
import EntryService from '../../services/EntryService';

document.title = 'Поиск наставников — Ищу наставника'

let auth = useAuth()

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

let towns = (await TownService.getTowns()).data
let schools = (await SchoolService.get_all()).data

let town = ref(auth.getAuthStatus() ? 
  auth.getUser().town : 
  towns.find(town => town._id === '641c882f9a4751bf88848223')
)

let school = ref(auth.getAuthStatus() ? 
  auth.getUser().school : 
  { name: 'Все', _id: 'all' }
)

let mentorship_entries = ref((await EntryService.get('mentor', town.value._id, school.value._id)).data.filter(entry => !entry.responses.includes(auth.getUser()._id) && (entry.author._id !== auth.getUser()._id) && (entry.school._id == school.value._id || (entry.town._id === town.value._id && school.value._id === 'all'))))
shuffle(mentorship_entries.value)

async function updateEntries() {
  mentorship_entries.value = (await EntryService.get('mentor', town.value._id, school.value._id)).data.filter(entry => !entry.responses.includes(auth.getUser()._id) && (entry.author._id !== auth.getUser()._id) && (entry.school._id == school.value._id || (entry.town._id === town.value._id && school.value._id === 'all')))
  shuffle(mentorship_entries.value)
}

function schools_in_town() {
  return schools.filter(sch => sch.town === town.value._id)
}
</script>

<template>
  <v-container>
    <MainTitle>Поиск наставников</MainTitle>

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
          :items="[{name: 'Все', _id: 'all'}, ...schools_in_town()]"
          item-title="name"
          return-object
          @update:model-value="updateEntries"
          variant="solo"
          hide-details
        ></v-select>
      </v-col>
    </v-row>
    
    <!-- Собирать с town_id т е забирать не всё
         Не показывать если забанили
         Пересылать на авторизацию если не вошли
         Всегда применять фильтр по городу и школе челика
         Не показывать у самого челика
         Не показывать если чел стал наставляемым
         Расставляем в рандомном порядке - имитируем индивидуальный подбор))))
    -->
    <v-row class="w-100 mt-5 flex-row flex-wrap">
      <v-col 
        cols="12" sm="6" xs="12"
        v-for="entry in mentorship_entries"
        :key="entry._id"
      >
        <Suspense>
          <MentorEntry :entry="entry" :show_location="school._id === 'all'" />
        </Suspense>
      </v-col>
    </v-row>
    <v-col 
      cols="12" sm="6" xs="12" 
      class="text-h6 ma-auto font-weight-medium mt-4 text-center"
      v-if="mentorship_entries.length === 0"
    >Записей нет, или вы на всё откликнулись</v-col>
  </v-container>
</template>