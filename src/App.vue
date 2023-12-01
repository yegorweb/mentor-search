<script setup lang="ts">
import { useSchool } from './stores/school';
import { useTown } from './stores/town';

useTown().fetchTowns()
useTown().fetchAdministeredTowns()
useSchool().fetchAdministeredSchools()
</script>

<template>
  <Suspense>
    <router-view></router-view>
  </Suspense>
</template>
