<script setup lang="ts">
defineProps({
  modelValue: {
    type: Boolean,
  }
})

let emit = defineEmits(['update:modelValue'])
</script>

<template>
  <v-icon 
    @click="emit('update:modelValue', false)"
    class="pa-4"
    style="position: absolute; top: 4px; right: 4px;"
  >
    mdi-close
  </v-icon>
</template>
