<script setup lang="ts">
import { useRouter } from "vue-router"
import { User } from "../types/user.interface";

let router = useRouter()

let props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

let user: User = props.user as any
</script>

<template>
  <v-row 
    @click="router.push(`/user/${user._id}`)" 
    class="flex-row ma-0 pa-0 flex-nowrap align-center justify-start cursor-pointer"
  >
    <v-avatar 
      :image="user.avatar_url"
      color="blue"
    />
    <div class="d-flex ml-4 flex-column justify-start">
      <div
        style="line-height: 1.2;"
        class="font-author font-weight-semibold"
      >
        {{ user.name }}
      </div>
      <div 
        class="text-gray lh-1 text-body-2" 
        v-if="user.ranks.length>0"
      >
        {{ user.ranks.join(', ') }}
      </div>
    </div>
  </v-row>
</template>
