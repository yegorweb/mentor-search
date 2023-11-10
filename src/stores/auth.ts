import { defineStore } from "pinia"
import AuthService from "../services/AuthService"
import { User } from "../types/user.interface"
import { ref } from "vue"

export const useAuth = defineStore('auth', () => {
  let user = ref<User | null>()

  async function registration(data: any): Promise<void> {
    try {
      const response = await AuthService.registration(data)
      localStorage.setItem('token', response.data.accessToken)

      user.value = response.data.user
      
      localStorage.setItem('newUser', 'true')
    } catch {}
  }

  async function login(email: string, password: string): Promise<void> {
    try {
      const response = await AuthService.login(email, password)
      localStorage.setItem('token', response.data.accessToken)

      user.value = response.data.user
    } catch {}
  }

  async function checkAuth(): Promise<void> {
    try {
      if (!localStorage.getItem('token'))
        return
        
      const response = await AuthService.refresh()
      localStorage.setItem('token', response.data.accessToken)

      user.value = response.data.user
    } catch {
      await logout()
    }
  }

  async function logout(): Promise<void> {
    try {
      localStorage.removeItem('token')
      await AuthService.logout()

      localStorage.removeItem('newUser')
    } catch {}
  }

  async function updateUser(new_user: any) {
    try {
      await AuthService.updateUser(new_user)
    } catch {}
  }

  return { user, registration, login, checkAuth, logout, updateUser }
})
