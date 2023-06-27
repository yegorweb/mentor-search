import { defineStore } from "pinia"
import AuthService from "../services/AuthService"
import { User } from "../types/user.interface"

export const useAuth = defineStore('auth', () => {
  let isAuth: boolean = false
  let user: User | null

  function getAuthStatus() {
    return isAuth
  }

  function getUser() {
    return user
  }

  async function registration(data: any) {
    try {
      const response = await AuthService.registration(data)
      localStorage.setItem('token', response.data.accessToken)

      isAuth = true
      user = response.data.user
      
      localStorage.setItem('newUser', 'true')
      window.location.href = user ? `/user/${user._id}` : '/'
    } catch (err) {}
  }

  async function login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password)
      localStorage.setItem('token', response.data.accessToken)

      isAuth = true
      user = response.data.user

      window.location.href = user ?`/user/${user._id}` : '/'
    } catch (err) {}
  }

  async function checkAuth(): Promise<void> {
    try {
      if (!localStorage.getItem('token'))
        return
        
      const response = await AuthService.refresh()
      localStorage.setItem('token', response.data.accessToken)

      isAuth = true
      user = response.data.user
    } catch (err) {
      await logout()
    }
  }

  async function logout(): Promise<void> {
    try {
      localStorage.removeItem('token')
      const response = await AuthService.logout()

      localStorage.setItem('newUser', 'false')
      window.location.href = '/'
    } catch (err) {}
  }

  async function updateUser(user: any) {
    try {
      user = (await AuthService.updateUser(user)).data
    } catch (err) {}
  }

  return { getAuthStatus, getUser, registration, login, checkAuth, logout, updateUser }
})
