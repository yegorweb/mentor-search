import { AxiosResponse } from "axios"
import { defineStore } from "pinia"
import { ref } from "vue"
import EntryService from "../services/EntryService"
import Entry from "../types/entry.interface"
import { EntryType } from "../types/entry_types"
import { User } from "../types/user.interface"

export const useEntry = defineStore('entry', () => {
  let seen_response_id = ref()

  async function get(
    type: EntryType, 
    town_id: string, 
    school_id: string
  ): Promise<Entry[]> {
    try {
      return (await EntryService.get(type, town_id, school_id)).data
    } catch {
      return []
    }
  }

  async function get_by_id(_id: string): Promise<Entry | undefined> {
    try {
      return (await EntryService.get_by_id(_id)).data
    } catch {}
  }
  
  async function get_by_author(_id: string): Promise<Entry[]> {
    try {
      return (await EntryService.get_by_author(_id)).data
    } catch {
      return []
    }
  }
  
  async function get_my_entries(): Promise<Entry[]> {
    try {
      return (await EntryService.get_my_entries()).data
    } catch {
      return []
    }
  }
  
  async function get_entries_to_moderation(): Promise<Entry[]> {
    try {
      return (await EntryService.get_entries_to_moderation()).data
    } catch {
      return []
    }
  }
  
  async function getResponses(entry_id: string): Promise<User[]> {
    try {
      return (await EntryService.getResponses(entry_id)).data
    } catch {
      return []
    }
  }
  
  async function create(entry: object): Promise<AxiosResponse | void> {
    try {
      return await EntryService.create(entry)
    } catch {}
  }
  
  async function edit(entry_id: string, data: object): Promise<AxiosResponse | void> {
    try {
      return await EntryService.edit(entry_id, data)
    } catch {}
  }

  async function response(entry_id: string): Promise<AxiosResponse | void> {
    try {
      return await EntryService.response(entry_id)
    } catch {}
  }

  async function cancel_response(entry_id: string): Promise<AxiosResponse | void> {
    try {
      return await EntryService.cancel_response(entry_id)
    } catch {}
  }

  async function verify(entry_id: string, moderation_result: boolean): Promise<void> {
    try {
      await EntryService.verify(entry_id, moderation_result)
    } catch {}
  }

  async function delete_entry(entry_id: string): Promise<void> {
    try {
      await EntryService.delete(entry_id)
    } catch {}
  }

  return { 
    seen_response_id,
    get, 
    get_by_id, 
    get_by_author, 
    get_my_entries,
    get_entries_to_moderation,
    getResponses,
    create,
    edit,
    response,
    cancel_response, 
    verify,
    delete_entry
  }
})
