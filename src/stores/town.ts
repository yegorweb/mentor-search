import { defineStore } from "pinia"
import TownService from "../services/TownService"
import Town from "../types/town.interface"
import { ref } from "vue"

export const useTown = defineStore('town', () => {
  let towns = ref<Town[]>([{
    _id: '641c882f9a4751bf88848223',
    name: 'Глазов'
  }])
  let administered_towns = ref<Town[]>([])
  let loading = ref(true)
  let loading_administered_towns = ref(true)

  async function fetchTowns(): Promise<void> {
    loading.value = true
    towns.value = await get_all()
    loading.value = false
  }

  async function get_by_id(_id: string): Promise<Town | undefined> {
    try {
      return (await TownService.get_by_id(_id)).data
    } catch {}
  }

  async function get_all(): Promise<Town[]> {
    try {
      return (await TownService.get_all()).data
    } catch {
      return []
    }
  }

  async function create(name: string): Promise<void> {
    try {
      await TownService.create(name)
    } catch {}
  }

  async function fetchAdministeredTowns(): Promise<void> {
    loading_administered_towns.value = true
    try {
      administered_towns.value = (await TownService.getAdministeredTowns()).data
    } catch {}
    loading_administered_towns.value = false
  }

  return { 
    towns, 
    administered_towns, 
    loading, 
    loading_administered_towns, 
    fetchTowns, 
    get_by_id, 
    get_all, 
    create, 
    fetchAdministeredTowns
  }
})
