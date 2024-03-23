import { defineStore } from "pinia"
import { ref } from "vue"
import EntryAPI from "../api/EntryAPI"
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
      return (await EntryAPI.get(type, town_id, school_id)).data
    } catch {
      return []
    }
  }

  async function get_by_id(_id: string): Promise<Entry | undefined> {
    try {
      return (await EntryAPI.get_by_id(_id)).data
    } catch {}
  }
  
  async function get_by_author(_id: string): Promise<Entry[]> {
    try {
      return (await EntryAPI.get_by_author(_id)).data
    } catch {
      return []
    }
  }
  
  async function get_my_entries(): Promise<Entry[]> {
    try {
      return (await EntryAPI.get_my_entries()).data
    } catch {
      return []
    }
  }
  
  async function get_entries_to_moderation(): Promise<Entry[]> {
    try {
      return (await EntryAPI.get_entries_to_moderation()).data
    } catch {
      return []
    }
  }
  
  async function getResponses(entry_id: string): Promise<User[]> {
    try {
      return (await EntryAPI.getResponses(entry_id)).data
    } catch {
      return []
    }
  }
  
  async function create(entry: object): Promise<void> {
    try {
      await EntryAPI.create(entry)
    } catch {}
  }
  
  async function edit(entry_id: string, data: object): Promise<void> {
    try {
      await EntryAPI.edit(entry_id, data)
    } catch {}
  }

  async function response(entry_id: string): Promise<void> {
    try {
      await EntryAPI.response(entry_id)
    } catch {}
  }

  async function cancel_response(entry_id: string): Promise<void> {
    try {
      await EntryAPI.cancel_response(entry_id)
    } catch {}
  }

  async function verify(entry_id: string, moderation_result: boolean): Promise<void> {
    try {
      await EntryAPI.verify(entry_id, moderation_result)
    } catch {}
  }

  async function delete_entry(entry_id: string): Promise<void> {
    try {
      await EntryAPI.delete(entry_id)
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
