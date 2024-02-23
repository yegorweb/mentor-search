<script setup lang="ts">
import MainTitle from '../components/MainTitle.vue'

document.title = 'О проекте — Ищу наставника'
</script>

<template>
  <v-container>
    <MainTitle>О проекте</MainTitle>

    <div class="mt-5 text-justify">
      <strong>«Ищу наставника»</strong> — посредник между клубами, наставниками, преподавателями и учениками. У проекта есть несколько функций:
      <ul style="list-style-position: inside;">
        <li>Площадка объявлений для клубов и наставников</li>
        <li>Единая база клубов и наставников</li>
        <li>Развитие культа преподавания и совместной работы</li>
      </ul>
    </div>
    <div class="mt-2">Автор: <a href="https://vk.com/yegorwebdev" target="_blank">Князев Егор</a></div>
  </v-container>
</template>
