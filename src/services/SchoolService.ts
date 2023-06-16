import $api from "../plugins/axios"

export default {
  async get_by_id(_id: string) {
    return $api.get('/school/get-by-id', { params: { _id }})
  },
  async get_all() {
    return $api.get('/school/get-all')
  },
  async get_all_in_town(_id: string) {
    return $api.get('/school/get-all-in-town', { params: { _id }})
  },
  async create(name: string) {
    return $api.post('school/create', { name })
  },
}