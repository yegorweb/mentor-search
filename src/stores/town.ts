import { defineStore } from "pinia"
import TownService from "../services/TownService"
import Town from "../types/town.interface"
import { ref } from "vue"

export const useTown = defineStore('town', () => {
  let towns = ref<Town[]>([])

  async function fetchTowns(): Promise<void> {
    towns.value = await get_all()
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

  async function getAdministeredTowns(): Promise<Town[]> {
    try {
      return (await TownService.getAdministeredTowns()).data
    } catch {
      return []
    }
  }

  return { towns, fetchTowns, get_by_id, get_all, create, getAdministeredTowns }
})
