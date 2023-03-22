import $api from "../plugins/axios"

export default {
  async get_by_id(_id) {
    return $api.get('/school/get-by-id', _id)
  }
}