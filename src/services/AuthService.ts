import $api from '../plugins/axios'

export default {
	registration(user: any) {
		return $api.post('/auth/registration', user)
	},
	login(email: string, password: string) {
		return $api.post('/auth/login', { email, password })
	},
	resetPassword(password: string, token: string) {
		return $api.post('/auth/reset-password', { password, token })
	},
	forgotPassword(email: string) {
		return $api.post('/auth/forgot-password', { email })
	},
	logout() {
		return $api.post('/auth/logout')
	},
	updateUser(user: any) {
		return $api.post('/auth/update', { user })
	},
	refresh() {
		return $api.get('/auth/refresh')
	},
}
