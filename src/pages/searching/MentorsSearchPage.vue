<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'
</script>

<template>
  <v-container class="mt-1">
    <BackButton>назад</BackButton>
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
    <v-row>
      <v-col>
        
      </v-col>
    </v-row>
  </v-container>
</template>