import { defineStore } from "pinia";
import UserAPI from "../api/UserAPI";
import Entry from "../types/entry.interface";
import { User } from "../types/user.interface";

export const useUser = defineStore('user', () => {
  async function get_by_id(_id: string): Promise<User | undefined> {
    try {
      return (await UserAPI.get_by_id(_id)).data
    } catch {}
  }

  async function get_my_responses(): Promise<Entry[]> {
    try {
      return (await UserAPI.get_my_responses()).data
    } catch {
      return []
    }
  }

  async function get_all_by_school(_id: string): Promise<User[]> {
    try {
      return (await UserAPI.get_all_by_school(_id)).data
    } catch {
      return []
    }
  }

  async function changeUser(user: object): Promise<void> {
    try {
      await UserAPI.changeUser(user)
    } catch {}
  }

  async function getRoles(user_id: string): Promise<{
    role: string,
    name: string,
    have_access: boolean
  }[]> {
    try {
      return (await UserAPI.getRoles(user_id)).data
    } catch {
      return []
    }
  }

  return { get_by_id, get_my_responses, get_all_by_school, changeUser, getRoles }
})
