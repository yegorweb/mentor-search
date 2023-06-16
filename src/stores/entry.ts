import { defineStore } from "pinia"
import EntryService from "../services/EntryService"
import Entry from "../types/entry.interface"
import { EntryType } from "../types/entry_types"
import School from "../types/school.interface"
import Town from "../types/town.interface"
import { useAuth } from "./auth"

export const useEntry = defineStore('entry', () => {
  let auth = useAuth()
  let user = auth.getUser()

  async function get(
    type: EntryType, 
    town_id: string, 
    school_id: string
  ): Promise<Entry[] | undefined> {
    try {
      return (await EntryService.get(type, town_id, school_id)).data
    } catch {}
  }

  async function get_by_id(_id: string): Promise<Entry | undefined> {
    try {
      return (await EntryService.get_by_id(_id)).data
    } catch {}
  }
  
  async function get_by_author(_id: string): Promise<Entry[] | undefined> {
    try {
      return (await EntryService.get_by_author(_id)).data
    } catch {}
  }
  
  async function get_entries_to_moderation(): Promise<Entry[] | undefined> {
    try {
      return (await EntryService.get_entries_to_moderation()).data
    } catch {}
  }
  
  async function create(entry: object) {
    try {
      return await EntryService.create(entry)
    } catch {}
  }
  
  async function edit(entry_id: string, data: object) {
    try {
      return await EntryService.edit(entry_id, data)
    } catch {}
  }

  async function response(entry_id: string) {
    try {
      return await EntryService.response(entry_id)
    } catch {}
  }

  async function cancel_response(entry_id: string) {
    try {
      return await EntryService.cancel_response(entry_id)
    } catch {}
  }

  async function verify(entry_id: string, moderation_result: boolean) {
    try {
      return await EntryService.verify(entry_id, moderation_result)
    } catch {}
  }

  async function delete_entry(entry_id: string) {
    try {
      return await EntryService.delete(entry_id)
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