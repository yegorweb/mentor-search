<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '../components/BackButton.vue';
import EntryService from '../services/EntryService';
import { useAuth } from '../stores/auth';
import { FieldContext, useField, useForm } from 'vee-validate'
import { User } from '../types/user.interface';
import { EntryType } from '../types/entry_types';

let user: User = useAuth().getUser() as any
let router = useRouter()

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
let variant: Ref<EntryType | null> = ref(null)

let has_limit = ref(false)
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

let subject: FieldContext<string> = useField('subject')
let description: FieldContext<string> = useField('description')
let limit: FieldContext<string> = useField('limit')

const submit = handleSubmit(async values => {
  loading.value = true

  await EntryService.create(Object.assign(values, {
    type: variant.value,
    school: user.school._id,
    town: user.town._id,
  }))
  .then(() => router.push(`/user/${user._id}`))
  .finally(() => loading.value = false)
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
      <Transition name="bounce">
        <v-form @submit.prevent="submit" v-if="variant" class="d-flex flex-column align-center justify-center w-100">
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