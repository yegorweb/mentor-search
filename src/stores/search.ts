import { defineStore } from "pinia";
import { ref } from "vue";
import Entry from "../types/entry.interface";
import School from "../types/school.interface";
import Town from "../types/town.interface";
import { useAuth } from "./auth";
import { useTown } from "./town";

export const useSearch = defineStore('search', () => {
  let user = useAuth().user

  let town = ref<Town>(user ? 
    user.school.town : 
    useTown().towns.find(town => town.name === 'Глазов') as any
  )
  let school = ref<School | null>(user ? 
    user.school : 
    { name: 'Все', _id: 'all' } as any
  )
  let last_entry_id = ref<string>()
  let delta = ref<number>(0)

  return { town, school, last_entry_id, delta }
})
