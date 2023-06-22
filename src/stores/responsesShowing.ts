import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export const useResponsesShowing = defineStore('responsesShowing', () => {
  let showing = ref(false)
  let responses = ref<string[]>([])

  return { showing, responses }
})
