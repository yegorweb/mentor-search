<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'
</script>

<template>
  <v-container class="mt-1">
    <BackButton>назад</BackButton>
    <div class="text-h4 mt-1 font-weight-bold">Поиск наставнков</div>
    <v-btn class="mt-4 text-capitalize text-body-1" variant="tonal" prepend-icon="mdi-filter">Фильтр</v-btn>
  </v-container>
</template>