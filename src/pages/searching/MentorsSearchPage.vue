<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'
import MainTitle from '../../components/MainTitle.vue';
import MentorEntry from '../../components/entries/MentorEntry.vue'
import { mentorship_entries } from '../../fakeDB/mentorship-entries';
import { ref } from 'vue';
import { towns } from '../../fakeDB/towns';
import { schools } from '../../fakeDB/schools';

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

shuffle(mentorship_entries)

// КОСТЫЛЬ
// Надо по умолчанию город и школу пользователя
let town_id = ref('640f4ac9145a0da782eb1a95')
let school_id = ref('640f4af989029a9d95db4b19')

let school = (): any => { return schools.find(sch => sch.id === school_id.value) }
let schools_in_town = (): any => { return towns.find(town => town.id === town_id.value)?.schools }
</script>

<template>
  <v-container>
    <MainTitle>Поиск наставников</MainTitle>

    <!-- Filter -->
    <v-row class="ma-0 pa-0 mt-4" style="gap: 12px;">
      <v-col cols="12" md="4" sm="8" xs="12" class="ml-0 pa-0">
        <v-select
          label="Город"
          v-model="town_id"
          :items="towns"
          item-title="name"
          item-value="id"
          variant="solo"
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="12" md="4" sm="8" xs="12" class="ma-0 pa-0">
        <v-select
          label="Школа"
          v-model="school_id"
          :items="[{name: 'Все', id: 'all'}, ...schools_in_town().map(el => el = schools.find(i => i.id === el))]"
          item-title="name"
          @update:model-value="shuffle(mentorship_entries)"
          item-value="id"
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
    <v-row class="mt-5">
      <template
        v-for="entry in mentorship_entries" 
        :key="entry.id"
      >
        <v-col 
          v-if="entry.school_id == school_id || (entry.town_id === town_id && school_id === 'all')"
          cols="12" sm="6" xs="12"
        >
          <MentorEntry :entry="entry" :show_location="school_id === 'all'" />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>