<script setup lang="ts">
import { ref } from 'vue';
import BackButton from '../components/BackButton.vue';
import router from '../router';
import EntryService from '../services/EntryService';
import { useAuth } from '../stores/auth';

let user = useAuth().getUser()

let variants = [{
  name: 'Запись',
  type: 'mentor'
}, 
{
  name: 'Урок',
  type: 'lesson'
}, 
{
  name: 'Клуб',
  type: 'club'
}]
let variant = ref()
let title = ref('')
let description = ref('')
let has_limit = ref(false)
let limit = ref()

console.log(user)
async function submit() {
  await EntryService.create(limit.value ? { 
    type: variant.value,
    subject: title.value,
    description: description.value,
    school: user.school._id,
    town: user.town._id,
    limit: limit.value
  } : { 
    type: variant.value,
    subject: title.value,
    description: description.value,
    school: user.school._id,
    town: user.town._id,
  }).then(() => router.push(`/user/${user._id}`))
}
</script>

<template>
  <v-container>
    <BackButton />

    <v-col cols="12" sm="8" lg="5" class="ma-auto">
      <div class="text-h5 text-center font-weight-bold">Создать</div>
  
      <v-select 
        label="Что?"
        :items="variants"
        v-model="variant"
        item-title="name"
        item-value="type"
        variant="solo"
        class="mt-4"
      />
      <v-row v-if="variant" class="ma-0 pa-0 flex-column align-center">
        <v-text-field
          label="Заголовок"
          :placeholder="variant == 'Клуб' ? 'Клуб любителей Мафии' : 'Биология'"
          v-model="title"
          variant="solo"
          class="w-100"
        />
        <v-textarea 
          label="Описание"
          v-model="description"
          variant="solo"
          class="w-100"
        />
        <v-checkbox 
          label="Лимит учеников"
          v-model="has_limit"
          class="w-100"
        />
        <v-text-field 
          type="tel"
          variant="solo"
          v-if="has_limit"
          :rules="[
            v => !!v || 'заполните поле или уберите лимит',
            v => /^\d+$/.test(v) || 'неверное значение',
          ]"
          label="Сколько?"
          v-model="limit"
          class="w-100"
        />

        <v-btn color="accent" @click="submit">Отправить</v-btn>
      </v-row>
    </v-col>
  </v-container>
</template>