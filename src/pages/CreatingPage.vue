<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '../components/BackButton.vue';
import EntryService from '../services/EntryService';
import { useAuth } from '../stores/auth';
import { useField, useForm } from 'vee-validate'

let user = useAuth().getUser()
let router = useRouter()

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

let has_limit = ref(false)
let loading = ref(false)

const { meta, handleSubmit, handleReset } = useForm({
  validationSchema: {
    subject(value) {
      if (!value || value.length < 4) return 'слишком короткий заголовок'
      if (value.length > 25) return 'слишком длинный заголовок'
      return true
    },
    description(value) {
      if (!value || value.length < 20) return 'слишком короткое описание' 
      if (value.length > 150) return 'слишком длинное описание'
      return true
    },
    limit(value) {
      if (!has_limit.value) return true
      if (!value || value.length === 0) return 'заполните поле или уберите лимит'
      if (!/^\d+$/.test(value) || !(Number(value)>0)) return 'неверное значение'
      if (Number(value)>300) return 'многовато'
      return true
    },
  },
})

let subject = useField('subject')
let description = useField('description')
let limit = useField('limit')

const submit = handleSubmit(async values => {
  loading.value = true

  await EntryService.create(Object.assign(values, {
    type: variant.value,
    school: user.school._id,
    town: user.town._id,
  }))
  .then(() => {
    router.push(`/user/${user._id}`)
    loading.value = false
  })
  .catch(() => {
    loading.value = false
  })
})
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
      <v-form @submit.prevent="submit" v-if="variant" class="d-flex flex-column align-center justify-center w-100">
        <v-text-field
          label="Заголовок"
          :placeholder="variant == 'Клуб' ? 'Клуб любителей Мафии' : 'Биология'"
          v-model="subject.value.value"
          :error-messages="subject.errorMessage.value"
          variant="solo"
          class="w-100"
        />
        <v-textarea 
          label="Описание"
          v-model="description.value.value"
          :error-messages="description.errorMessage.value"
          :counter="150"
          variant="solo"
          class="w-100"
        />
        <v-checkbox 
          label="Лимит учеников"
          v-model="has_limit"
          class="w-100"
        />
        <v-text-field 
          type="number"
          variant="solo"
          v-if="has_limit"
          label="Сколько?"
          v-model="limit.value.value"
          :error-messages="limit.errorMessage.value"
          class="w-100"
        />

        <v-btn 
          color="accent" 
          :disabled="!meta.valid" 
          type="submit" 
          :loading="loading"
        >Отправить</v-btn>
      </v-form>
    </v-col>
  </v-container>
</template>