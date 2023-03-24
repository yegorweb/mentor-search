import $api from "../plugins/axios"

export default {
  async get_by_id(_id) {
    return $api.get('/school/get-by-id', _id)
  },
  async get_all() {
    return $api.get('/school/get-all')
  },
  async get_all_in_town(_id) {
    return $api.get('/school/get-all-in-town', _id)
  },
  async create(name) {
    return $api.post('school/create', { name, token: localStorage.getItem('token') })
  },
  async switch_to_active(_id) {
    return $api.post('school/switch-to-active', { _id, token: localStorage.getItem('token') })
  }  
}