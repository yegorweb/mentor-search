import $api from "../plugins/axios"

export default {
  async get(type, town_id, school_id) {
    return $api.get('/entry/get', { params: { type, town_id, school_id }})
  },
  async get_by_id(_id) {
    return $api.get('/entry/get-by-id', { params: { _id }})
  },
  async get_by_author(_id) {
    return $api.get('/entry/get-by-author', { params: { _id }})
  },
  async get_entries_to_moderation() {
    return $api.get('/entry/get-entries-to-moderation')
  },
  async create(entry) {
    return $api.post('/entry/create', { entry })
  },
  async update(entry) {
    return $api.post('/entry/update', { entry })
  },
  async response(entry_id) {
    return $api.post('/entry/response', { entry_id })
  },
  async cancel_response(entry_id) {
    return $api.post('/entry/cancel-response', { entry_id })
  },
  async verify(entry_id, moderation_result) {
    return $api.post('/entry/verify', { entry_id, moderation_result })
  },
  async delete(entry_id) {
    return $api.delete('/entry/delete', { params: { entry_id } })
  },
}