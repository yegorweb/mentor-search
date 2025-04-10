<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '../components/BackButton.vue';
import EntryAPI from '../api/EntryAPI';
import { useAuth } from '../stores/auth';
import { useField, useForm } from 'vee-validate'
import { User } from '../types/user.interface';
import { EntryType } from '../types/entry_types';
import { storeToRefs } from 'pinia';

let user: Ref<User> = storeToRefs(useAuth()).user as any
let router = useRouter()

let variants: {
  name: string,
  type: EntryType
}[] = [
  {
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
  }
]
let variant = ref<EntryType|null>(null)

let additional = ref(false)
let has_limit = ref(false)
let in_another_school = ref(false)
let loading = ref(false)

const { meta, handleSubmit, validate } = useForm({
  initialValues: {
    school: user.value.school._id,
    subject: '',
    description: '',
    limit: null
  },
  validationSchema: {
    subject(value: string) {
      if (value.trim().length < 4) return 'слишком короткий заголовок'
      if (value.length > 32) return 'слишком длинный заголовок'
      
      return true
    },
    description(value: string) {
      if (value.trim().length < 20) return 'слишком короткое описание' 
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

let subject = useField<string>('subject')
let description = useField<string>('description')
let limit = useField<string>('limit')

const submit = handleSubmit(async values => {
  loading.value = true

  await EntryAPI.create(Object.assign(values, {
    type: variant.value,
    school: user.value.school._id,
  }))
  .then(() => router.push(`/user/${user.value._id}`))
  
  loading.value = false
})
</script>

<template>
  <v-container class="mt-1">
    <BackButton />

    <v-col 
      cols="12" sm="8" lg="5" 
      class="ma-auto"
    >
      <div class="text-h5 text-center font-weight-bold">
        Создать
      </div>
  
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
        <v-form 
          v-if="variant" 
          @submit.prevent="submit" 
          class="d-flex flex-column align-center justify-center w-100"
        >
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
            :class="{ 'w-100': true, 'mt-2': !subject.meta.valid }"
          />

          <div 
            @click="additional = !additional" 
            :class="`${description.meta.valid ? '' : 'mt-2'} pt-2 pb-2 w-100 cursor-pointer text-grey-darken-3 user-select-none`"
          >
            <span :class="`mdi mdi-triangle${additional ? '' : '-down'}`" />

            <span> Дополнительно</span>
          </div>

          <TransitionGroup name="slide-fade">
            <template v-if="additional">
              <v-checkbox 
                label="Лимит учеников"
                v-model="has_limit"
                @click="validate()"
                class="w-100"
                hide-details
              />
              
                <v-text-field 
                  type="number"
                  variant="solo"
                  v-show="has_limit"
                  label="Сколько?"
                  v-model="limit.value.value"
                  :error-messages="limit.errorMessage.value"
                  class="w-100 mb-3"
                />

              <v-checkbox 
                label="Добавить школу"
                v-model="in_another_school"
                @click="validate()"
                class="w-100"
                hide-details
              />
            </template>
          </TransitionGroup>
  
          <v-btn 
            color="accent" 
            :disabled="!meta.valid" 
            type="submit" 
            :loading="loading"
          >
            Отправить
          </v-btn>
        </v-form>
      </Transition>
    </v-col>
  </v-container>
</template>

<style lang="scss">

</style>
