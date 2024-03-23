import $api from "../plugins/axios"

export default {
  get_by_id(_id: string) {
    return $api.get('/school/get-by-id', { params: { _id }})
  },
  get_all() {
    return $api.get('/school/get-all')
  },
  get_all_in_town(_id: string) {
    return $api.get('/school/get-all-in-town', { params: { _id }})
  },
  get_administered_schools() {
    return $api.get('/school/get-administered-schools')
  },
  create(name: string, town_id: string) {
    return $api.post('school/create', { name, town_id })
  },
}
