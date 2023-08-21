import { defineStore } from "pinia";
import SchoolService from "../services/SchoolService";
import School from "../types/school.interface";

export const useSchool = defineStore('school', () => {
  async function get_by_id(_id: string): Promise<School | undefined> {
    try {
      return (await SchoolService.get_by_id(_id)).data
    } catch {}
  }

  async function get_all(): Promise<School[]> {
    try {
      return (await SchoolService.get_all()).data
    } catch {
      return []
    }
  }

  async function get_all_in_town(_id: string): Promise<School[] | undefined> {
    try {
      return (await SchoolService.get_all_in_town(_id)).data
    } catch {
      return []
    }
  }

  async function get_administered_schools(): Promise<School[]> {
    try {
      return (await SchoolService.get_administered_schools()).data
    } catch {
      return []
    }
  }

  async function create(name: string, town_id: string): Promise<void> {
    try {
      await SchoolService.create(name, town_id)
    } catch {}
  }

  return { get_by_id, get_all, get_all_in_town, get_administered_schools, create }
})
