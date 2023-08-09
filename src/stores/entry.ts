import { defineStore } from "pinia"
import EntryService from "../services/EntryService"
import Entry from "../types/entry.interface"
import { EntryType } from "../types/entry_types"

export const useEntry = defineStore('entry', () => {
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
  
  async function get_entries_to_moderation(): Promise<Entry[]> {
    try {
      return (await EntryService.get_entries_to_moderation()).data
    } catch {
      return []
    }
  }
  
  async function create(entry: object): Promise<void> {
    try {
      await EntryService.create(entry)
    } catch {}
  }
  
  async function edit(entry_id: string, data: object): Promise<void> {
    try {
      await EntryService.edit(entry_id, data)
    } catch {}
  }

  async function response(entry_id: string): Promise<void> {
    try {
      await EntryService.response(entry_id)
    } catch {}
  }

  async function cancel_response(entry_id: string): Promise<void> {
    try {
      await EntryService.cancel_response(entry_id)
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
    get, 
    get_by_id, 
    get_by_author, 
    get_entries_to_moderation,
    create,
    edit,
    response,
    cancel_response, 
    verify,
    delete_entry
  }
})
