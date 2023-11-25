<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'
</script>

<template>
  <v-container>
    <BackButton />

    <div class="mt-4 d-flex flex-column align-center">
      <div 
        style="font-size: 66px;" 
        class="font-weight-bold"
      >
        404
      </div>

      <v-btn 
        size="small"
        variant="tonal"
        to="/"
        class="text-body-2 pr-5 pl-5 mt-1 font-weight-semibold bg-button"
      >
        На главную
      </v-btn>
    </div>
  </v-container>
</template>
