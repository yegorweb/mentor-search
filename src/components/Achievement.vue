<script setup lang="ts">
import EntryContainer from './entries/EntryContainer.vue';

let props = defineProps({
  achievement: {
    type: Object,
    required: true
  }
})

let current_time = new Date(Date.now())
let entry_delta = current_time.getTime() - props.achievement.date

function getDate(time: number, first_case: string) {
  let delta = Math.abs(current_time.getTime() - time)
  let days_ago = Math.floor(delta/1000/60/60/24)

  let options = {
    month: "long",
    day: "numeric",
    year: current_time.getFullYear() != (new Date(time)).getFullYear() ? "numeric" : undefined
  }
  if (delta <= 86400000) 
    return (first_case == 'upper' ? 'Сегодня ' : 'cегодня ') + (new Date(time)).toLocaleTimeString('ru', { hour: 'numeric', minute: 'numeric' })

  return (new Date(time)).toLocaleString('ru', options as any)
}
</script>

<template>
  <EntryContainer>
    <div class="text-h6 font-weight-bold">{{ 
      props.achievement.achievement.split('')[0].toUpperCase() + props.achievement.achievement.slice(1)
    }}</div>
    <div class="mt-1">
      <span><v-icon icon="mdi-calendar" /></span>
      {{ getDate(props.achievement.date, 'upper') }}
    </div>
    <div 
      v-if="entry_delta > 0 && !props.achievement.forever"
    >
      <span><v-icon icon="mdi-clock-outline" /></span>
      Действует до {{ getDate(props.achievement.date + props.achievement.duration, 'lower') }}
    </div>
  </EntryContainer>
</template>