import $api from "../plugins/axios"

export default {
  async get_by_id(_id) {
    return $api.get('/school/get-by-id', { params: { _id }})
  },
  async get_all() {
    return $api.get('/school/get-all')
  },
  async get_all_in_town(_id) {
    return $api.get('/school/get-all-in-town', { params: { _id }})
  },
  async create(name) {
    return $api.post('school/create', { name })
  },
  async switch_to_active(_id) {
    return $api.post('school/switch-to-active', { _id })
  }  
}