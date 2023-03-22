import $api from "../plugins/axios"

export default {
  async get(type, town_id, school_id) {
    $api.get('/entry/get', { type, town_id, school_id })
  },  
  async get_by_id(_id) {
    $api.get('/entry/get-by-id', { _id })
  },
  async create(entry) {
    $api.post('/entry/create', { entry, token: localStorage.getItem('token') })
  },
  async update(entry) {
    $api.post('/entry/update', { entry, token: localStorage.getItem('token') })
  },
  async delete(entry) {
    $api.delete('/entry/delete', { entry, token: localStorage.getItem('token') })
  },
}