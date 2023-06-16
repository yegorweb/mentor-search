import axios from 'axios'
import { POSITION, useToast } from 'vue-toastification'
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
		if (response.data.message)
			toast.success(response.data.message, {
				position: POSITION.TOP_CENTER
			})

		return response
	}, 
	function (error) {
		if (error.response?.status !== 401) {
			toast.error(error.response?.data?.message, {
				position: POSITION.TOP_CENTER
			})
			console.log("ERROR: ", error)	
		}
		
		return error
	}
)

export default $api