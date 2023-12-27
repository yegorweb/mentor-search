import $api from "../plugins/axios"
import Entry from "../types/entry.interface"
import { EntryType } from "../types/entry_types"

export default {
  async get(type: EntryType, town_id: string, school_id: string) {
    return $api.get('/entry/get', { params: { type, town_id, school_id }})
  },
  async get_by_id(_id: string) {
    return $api.get('/entry/get-by-id', { params: { _id }})
  },
  async get_by_author(_id: string) {
    return $api.get('/entry/get-by-author', { params: { _id }})
  },
  async get_my_entries() {
    return $api.get('/entry/get-my-entries')
  },
  async get_entries_to_moderation() {
    return $api.get('/entry/get-entries-to-moderation')
  },
  async create(entry: object) {
    return $api.post('/entry/create', { entry })
  },
  async edit(entry_id: string, data: object) {
    return $api.post('/entry/edit', { entry_id, entry: data })
  },
  async response(entry_id: string) {
    return $api.post('/entry/response', { entry_id })
  },
  async getResponses(entry_id: string) {
    return $api.get('/entry/get-responses', { params: { entry_id } })
  },
  async cancel_response(entry_id: string) {
    return $api.post('/entry/cancel-response', { entry_id })
  },
  async verify(entry_id: string, moderation_result: boolean) {
    return $api.post('/entry/verify', { entry_id, moderation_result })
  },
  async delete(entry_id: string) {
    return $api.delete('/entry/delete', { params: { entry_id } })
  },
}
