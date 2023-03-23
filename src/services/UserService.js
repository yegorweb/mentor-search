import $api from '../plugins/axios'

export default {
  async get_by_id(_id) {
    return $api.get('/user/get-by-id', _id)
  },
  async get_my_responses() {
    return $api.get('/user/get-my-responses', localStorage.getItem('token'))
  }
}