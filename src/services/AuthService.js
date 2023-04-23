import $api from '../plugins/axios'

export default {
	async registration(user) {
		return $api.post('/auth/registration', user)
	},
	async login(email, password) {
		return $api.post('/auth/login', { email, password })
	},
	async resetPassword(password, token) {
		return $api.post('/auth/reset-password', { password, token })
	},
	async forgotPassword(email) {
		return $api.post('/auth/forgot-password', { email: email })
	},
	async logout() {
		return $api.post('/auth/logout')
	},
	async updateUser(user) {
		return $api.post('/auth/update', { user })
	},
	async refresh() {
		return $api.get('/auth/refresh')
	},
}