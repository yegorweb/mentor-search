<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '../components/BackButton.vue';
import { useAuth } from '../stores/auth';
import { useField, useForm } from 'vee-validate'
import { EntryType } from '../types/entry_types';
import { useEntry } from '../stores/entry';
import Entry from '../types/entry.interface';
import { User } from '../types/user.interface';
import { storeToRefs } from 'pinia';

let user: Ref<User> = storeToRefs(useAuth()) as any
let router = useRouter()

let entryStore = useEntry()

let props = defineProps(['id'])
let entry: Entry = await entryStore.get_by_id(props.id) as any

let variants: {
  name: string,
  type: EntryType
}[] = [{
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
let variant: Ref<EntryType> = ref(entry.type)

let has_limit = ref(entry.limit ? true : false) // я не тупой, это фича
let loading = ref(false)

const { meta, handleSubmit, handleReset, validate } = useForm({
  validationSchema: {
    subject(value: string) {
      if (!value || value.length < 4) return 'слишком короткий заголовок'
      if (value.length > 25) return 'слишком длинный заголовок'
      return true
    },
    description(value: string) {
      if (!value || value.length < 20) return 'слишком короткое описание' 
      if (value.length > 150) return 'слишком длинное описание'
      return true
    },
    limit(value: string) {
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

subject.value.value = entry.subject
description.value.value = entry.description
limit.value.value = entry.limit

const submit = handleSubmit(async values => {
  loading.value = true

  let value = Object.assign(values, {
    type: variant.value
  })
  has_limit.value ? value.limit = limit.value.value : null

  await entryStore.edit(props.id, value)
  .then(() => router.push(`/user/${user.value._id}`))
  .finally(() => loading.value = false)
})
</script>

<template>
  <v-container>
    <BackButton />

    <v-col cols="12" sm="8" lg="5" class="ma-auto">
      <div class="text-h5 text-center font-weight-bold">Редактирование</div>
  
      <v-select 
        label="Что?"
        :items="variants"
        v-model="variant"
        item-title="name"
        item-value="type"
        variant="solo"
        class="mt-4"
      />
      <Transition name="bounce">
        <v-form @submit.prevent="submit" class="d-flex flex-column align-center justify-center w-100">
          <v-text-field
            label="Заголовок"
            :placeholder="variant === 'club' ? 'Клуб любителей Мафии' : 'Биология'"
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
            @click="validate()"
            class="w-100"
            hide-details
          />
          <Transition name="bounce">
            <v-text-field 
              type="number"
              variant="solo"
              v-show="has_limit"
              label="Сколько?"
              v-model="limit.value.value"
              :error-messages="limit.errorMessage.value"
              class="w-100 mb-3"
            />
          </Transition>
  
          <v-btn 
            color="accent" 
            :disabled="!meta.valid" 
            type="submit" 
            :loading="loading"
          >Отправить</v-btn>
        </v-form>
      </Transition>
    </v-col>
  </v-container>
</template>
