<script setup lang="ts">
import Responses from '@/components/Responses.vue'
</script>

<template>
  <Suspense>
    <router-view></router-view>
  </Suspense>
  <Suspense>
    <Responses></Responses>
  </Suspense>
</template>

<style lang="scss">

</style>
