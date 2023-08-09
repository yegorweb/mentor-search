<script setup lang="ts">
import { useTown } from './stores/town';

useTown().fetchTowns()
</script>

<template>
  <Suspense>
    <router-view></router-view>
  </Suspense>
</template>
