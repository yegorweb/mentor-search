<script setup lang="ts">
import BackButton from './BackButton.vue'
</script>

<template>
  <div class="mt-1 d-flex flex-column justify-start">
    <BackButton />
    
    <div class="text-h4 mt-1 font-weight-bold">
      <slot />
    </div>
  </div>
</template>
