import $api from "../plugins/axios"

export default {
  async get_by_id(_id: string) {
    return $api.get('/town/get-by-id', { params: { _id }})
  },
  async get_all() {
    return $api.get('/town/all')
  },
  async create(name: string) {
    return $api.post('/town/create', { name })
  },
  async getAdministeredTowns() {
    return $api.get('/town/get-administered-towns')
  }
}
