import { defineStore } from "pinia"
import AuthService from "../services/AuthService"
import { ref } from "vue"

export const useAuth = defineStore('auth', () => {
  let isAuth = ref(false)
  let user = ref()

  function getAuthStatus() {
    return isAuth.value
  }

  function getUser() {
    return user.value
  }

  async function registration(user) {
    try {
      const response = await AuthService.registration(user)
      localStorage.setItem('token', response.data.accessToken)

      isAuth.value = true
      user.value = response.data.user
      
      return { success: true }
    } catch (err) { }
  }

  async function login(email, password) {
    try {
      const response = await AuthService.login(email, password)
      localStorage.setItem('token', response.data.accessToken)

      isAuth.value = true
      user.value = response.data.user

      return { success: true }
    } catch (err) { }
  }

  async function checkAuth() {
    try {
      const response = await AuthService.refresh()
      localStorage.setItem('token', response.data.accessToken)

      isAuth.value = true
      user.value = response.data.user
    } catch (err) {
      await logout()
    }
  }

  async function logout() {
    try {
      const response = await AuthService.logout()
      localStorage.removeItem('token')

      isAuth.value = false
      user.value = null
    } catch (err) {}
  }

  return { isAuth, getAuthStatus, getUser, registration, login, checkAuth, logout }
})