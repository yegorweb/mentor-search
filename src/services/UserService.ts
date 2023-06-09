import $api from '../plugins/axios'

export default {
  async get_by_id(_id: string) {
    return $api.get('/user/get-by-id', { params: { _id } })
  },
  async get_my_responses() {
    return $api.get('/user/get-my-responses')
  },
  async get_all_by_school(_id: string) {
    return $api.get('/user/get-all-by-school', { params: { _id } })
  },
  async changeUser(user: object) {
    return $api.post('/user/change-user', { user })
  },
}