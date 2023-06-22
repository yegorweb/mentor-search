import $api from '../plugins/axios'

export default {
	async registration(user: any) {
		return $api.post('/auth/registration', user)
	},
	async login(email: string, password: string) {
		return $api.post('/auth/login', { email, password })
	},
	async resetPassword(password: string, token: string) {
		return $api.post('/auth/reset-password', { password, token })
	},
	async forgotPassword(email: string) {
		return $api.post('/auth/forgot-password', { email: email })
	},
	async logout() {
		return $api.post('/auth/logout')
	},
	async updateUser(user: any) {
		return $api.post('/auth/update', { user })
	},
	async refresh() {
		return $api.get('/auth/refresh')
	},
}
