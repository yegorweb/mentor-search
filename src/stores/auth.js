import { defineStore } from "pinia"
import AuthService from "../services/AuthService"

export const useAuth = defineStore(() => {
  let isAuth = false
  let user

  function getAuthStatus() {
    return isAuth
  }

  function getUser() {
    return user
  }

  async function registration(user) {
    try {
      const response = await AuthService.registration(user)
      localStorage.setItem('token', response.data.accessToken)

      isAuth = true
      user = response.data.user
      
      return { success: true }
    } catch (err) { }
  }

  async function login(email, password) {
    try {
      const response = await AuthService.login(email, password)
      localStorage.setItem('token', response.data.accessToken)

      isAuth = true
      user = response.data.user

      return { success: true }
    } catch (err) { }
  }

  async function checkAuth() {
    try {
      const response = await AuthService.refresh()
      localStorage.setItem('token', response.data.accessToken)

      isAuth = true
      user = response.data.user
    } catch (err) {}
  }

  async function logout() {
    try {
      const response = await AuthService.logout()
      localStorage.removeItem('token')

      isAuth = false
      user = null
    } catch (err) {}
  }
})