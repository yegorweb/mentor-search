import { defineStore } from "pinia";
import SchoolService from "../services/SchoolService";
import School from "../types/school.interface";

export const useSchool = defineStore('school', () => {
  async function get_by_id(_id: string): Promise<School | undefined> {
    try {
      return (await SchoolService.get_by_id(_id)).data
    } catch {}
  }

  async function get_all(): Promise<School[] | undefined> {
    try {
      return (await SchoolService.get_all()).data
    } catch {}
  }

  async function get_all_in_town(_id: string): Promise<School[] | undefined> {
    try {
      return (await SchoolService.get_all_in_town(_id)).data
    } catch {}
  }

  async function create(name: string) {
    try {
      return (await SchoolService.create(name)).data
    } catch {}
  }

  return { get_by_id, get_all, get_all_in_town, create }
})
