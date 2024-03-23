import $api from '../plugins/axios'

export default {
  get_by_id(_id: string) {
    return $api.get('/user/get-by-id', { params: { _id } })
  },
  get_my_responses() {
    return $api.get('/user/get-my-responses')
  },
  get_all_by_school(_id: string) {
    return $api.get('/user/get-all-by-school', { params: { _id } })
  },
  changeUser(user: object) {
    return $api.post('/user/change-user', { user })
  },
  getRoles(user_id: string) {
    return $api.get('/user/get-roles', { params: { user_id } })
  },
}