import $api from "../plugins/axios"
import Entry from "../types/entry.interface"
import { EntryType } from "../types/entry_types"

export default {
  get(type: EntryType, town_id: string, school_id: string) {
    return $api.get('/entry/get', { params: { type, town_id, school_id }})
  },
  get_by_id(_id: string) {
    return $api.get('/entry/get-by-id', { params: { _id }})
  },
  get_by_author(_id: string) {
    return $api.get('/entry/get-by-author', { params: { _id }})
  },
  get_my_entries() {
    return $api.get('/entry/get-my-entries')
  },
  get_entries_to_moderation() {
    return $api.get('/entry/get-entries-to-moderation')
  },
  create(entry: object) {
    return $api.post('/entry/create', { entry })
  },
  edit(entry_id: string, data: object) {
    return $api.post('/entry/edit', { entry_id, entry: data })
  },
  response(entry_id: string) {
    return $api.post('/entry/response', { entry_id })
  },
  getResponses(entry_id: string) {
    return $api.get('/entry/get-responses', { params: { entry_id } })
  },
  cancel_response(entry_id: string) {
    return $api.post('/entry/cancel-response', { entry_id })
  },
  verify(entry_id: string, moderation_result: boolean) {
    return $api.post('/entry/verify', { entry_id, moderation_result })
  },
  delete(entry_id: string) {
    return $api.delete('/entry/delete', { params: { entry_id } })
  },
}
