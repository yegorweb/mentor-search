<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'
import MentorEntry from '../../components/entries/MentorEntry.vue'
import { mentorship_entries } from '../../fakeDB/mentorship-entries';

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
</script>

<template>
  <v-container class="mt-1">
    <BackButton />
    <div class="text-h4 mt-1 font-weight-bold">Поиск наставнков</div>
    <v-btn class="mt-4 text-capitalize text-body-1" variant="tonal" prepend-icon="mdi-filter">Фильтр</v-btn>

    <!-- Не показывать если забанили
         Пересылать на авторизацию если не вошли
         Всегда применять фильтр по городу и школе челика
         Не показывать у самого челика
         Добавить лайки
         Не показывать если чел стал наставляемым
         Расставляем в рандомном порядке - имитируем индивидуальный подбор))))
    -->
    <v-row class="mt-5">
      <v-col 
        v-for="entry in mentorship_entries" 
        :key="entry.id"
        cols="12" sm="6" xs="12"
      >
        <MentorEntry :entry="entry" />
      </v-col>
    </v-row>
  </v-container>
</template>