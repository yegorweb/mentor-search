import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export const useResponsesShowing = defineStore('responsesShowing', () => {
  let showing = ref(false)
  let responses: Ref<string[]> = ref([])

  return { showing, responses }
})