<script setup lang="ts">
import BackButton from '../../components/BackButton.vue';
import EntryContainer from '../../components/entries/EntryContainer.vue';
import { schools } from '../../fakeDB/schools';
import { towns } from '../../fakeDB/towns';
import { users } from '../../fakeDB/users';

var id = (new URL(document.location.href)).searchParams.get('id')
let user = users.find(user => user.id === id)

function getType(): string {
  if (user?.roles.includes('school-admin') || user?.roles.includes('global-admin')) {
    return 'админ'
  }
  if (user?.roles.includes('mentor')) {
    return 'наставник'
  }

  return 'наставляемый'
}

document.title = user?.name
</script>

<template>
  <v-container class="mt-1">
    <BackButton />

    <div
      style="column-gap: 30px;row-gap: 10px;" 
      class="box w-100 mt-4 d-flex flex-column flex-sm-row flex-nowrap justify-center justify-sm-start align-center align-sm-start"
    >
      <!-- Avatar -->
      <v-avatar :image="user?.avatar_url" color="blue" size="130"></v-avatar>
  
      <div class="d-flex flex-column justify-center justify-sm-start w-sm-100 align-center align-sm-start">
        <!-- Name -->
        <div class="text-h5 text-center font-weight-bold">{{ user?.name }}</div>
        
        <!-- Info -->
        <div 
          style="column-gap: 20px;" 
          class="d-flex mt-1 align-center justify-center justify-sm-start flex-wrap flex-row font-weight-bold text-text_gray"
        >
          <div>{{ getType() }}</div>
          <div v-if="user?.ranks.length != 0">
            <span><v-icon icon="mdi-star"></v-icon></span>
            {{ user?.ranks.join(', ') }}
          </div>
          <div v-if="user?.grade != 0">{{ user?.grade }} класс</div>
        </div>

        <!-- Town, school -->
        <div class="font-weight-bold text-text_gray">
          <span v-if="user?.town_id != '640f4ac9145a0da782eb1a95'">{{ 
            towns.find(town => town.id === user?.town_id)?.name + ', ' }}
          </span>
          {{ schools.find(sch => sch.id === user?.school_id)?.name }}
        </div>

        <!-- Description -->
        <div class="mt-2">
          {{ user?.description }}
        </div>

        <!-- Contacts -->
        <div class="d-flex mt-4 flex-row justify-start flex-wrap">
          <a 
            v-for="button in user?.contacts"
            :key="button.link"
            :href="button.link"
            style="text-decoration: none;"
          >
            <v-btn 
              size="small"
              variant="tonal" 
              class="text-body-2 pl-5 pr-5 mr-3 font-weight-semibold bg-button"
            >
              {{ button.name }}
            </v-btn>          
          </a>
        </div>
      </div>
    </div>
  </v-container>
</template>

<style scoped lang="scss">
.box {
  padding: 24px 30px;
  background: #FFFFFF;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}
</style>