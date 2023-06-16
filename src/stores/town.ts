import { defineStore } from "pinia"
import TownService from "../services/TownService"
import Town from "../types/town.interface"

export const useTown = defineStore('town', () => {
  async function get_by_id(_id: string): Promise<Town | undefined> {
    try {
      return (await TownService.get_by_id(_id)).data
    } catch {}
  }

  async function get_all(): Promise<Town[] | undefined> {
    try {
      return (await TownService.get_all()).data
    } catch {}
  }

  async function create(name: string) {
    try {
      return (await TownService.create(name)).data
    } catch {}
  }

  return { get_by_id, get_all, create }
})
