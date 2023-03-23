import axios from 'axios'
import { useToast } from 'vue-toastification'
const toast = useToast()

export const API_URL = import.meta.env.VITE_API_URL

const $api = axios.create({
	withCredentials: true,
	baseURL: API_URL
})

// for jwt auth
$api.interceptors.request.use((config) => {
	config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
	return config
})

$api.interceptors.response.use(
	function (response) {
		return response
	}, 
	function (error) {
		toast.error(error.response?.data?.message)
		console.log("ERROR: ", error)

		return error
	}
)

export default $api