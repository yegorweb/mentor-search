<script setup lang="ts">

</script>

<template>
  <div class="box w-100 h-100 d-flex flex-column justify-start">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.box {
  padding: 17px 28px;
  background: #FFFFFF;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}
</style>