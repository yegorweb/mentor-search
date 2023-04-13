import $api from "../plugins/axios"

export default {
  async getTowns() {
    return $api.get('/town/all')
  },
  async getTownById(_id) {
    return $api.get('/town/get-by-id', { params: { _id }})
  },
  async create(name) {
    return $api.post('/town/create', { name })
  }
}