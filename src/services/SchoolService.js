import $api from "../plugins/axios"

export default {
  async get_by_id(_id) {
    return $api.get('/school/get-by-id', _id)
  },
  async get_all_in_town(_id) {
    return $api.get('/school/get-all-in-town', _id)
  }
}