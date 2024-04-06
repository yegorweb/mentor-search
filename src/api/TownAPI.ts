import $api from "../plugins/axios"

export default {
  get_by_id(_id: string) {
    return $api.get('/town/get-by-id', { params: { _id }})
  },
  get_all() {
    return $api.get('/town/all')
  },
  create(name: string) {
    return $api.post('/town/create', { name })
  },
  getAdministeredTowns() {
    return $api.get('/town/get-administered-towns')
  }
}
