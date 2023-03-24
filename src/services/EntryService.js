import $api from "../plugins/axios"

export default {
  async get(type, town_id, school_id) {
    return $api.get('/entry/get', { type, town_id, school_id })
  },  
  async get_by_id(_id) {
    return $api.get('/entry/get-by-id', { _id })
  },
  async create(entry) {
    return $api.post('/entry/create', { entry, token: localStorage.getItem('token') })
  },
  async update(entry) {
    return $api.post('/entry/update', { entry, token: localStorage.getItem('token') })
  },
  async delete(entry) {
    return $api.delete('/entry/delete', { entry, token: localStorage.getItem('token') })
  },
}