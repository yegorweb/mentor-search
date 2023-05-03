import { defineStore } from "pinia";
import { ref } from "vue";

export const useResponsesShowing = defineStore('responsesShowing', () => {
  let showing = ref(false)
  let responses = ref([])

  return { showing, responses }
})