<script setup lang="ts">

</script>

<template>
  <div class="box w-100 h-100 pl-6 pr-6 pt-4 pb-4 pl-md-7 pr-md-7 pt-md-5 pb-md-5 d-flex flex-column justify-start">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.box {
  background: #FFFFFF !important;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}
</style>
