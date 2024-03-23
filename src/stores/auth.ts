import { defineStore } from "pinia"
import AuthAPI from "../api/AuthAPI"
import { User } from "../types/user.interface"
import { ref } from "vue"

export const useAuth = defineStore('auth', () => {
  let user = ref<User | null>()

  async function registration(data: any): Promise<void> {
    try {
      const response = await AuthAPI.registration(data)
      localStorage.setItem('token', response.data.accessToken)

      user.value = response.data.user
      
      localStorage.setItem('newUser', 'true')
    } catch {}
  }

  async function login(email: string, password: string): Promise<void> {
    try {
      const response = await AuthAPI.login(email, password)
      localStorage.setItem('token', response.data.accessToken)

      user.value = response.data.user
    } catch {}
  }

  async function checkAuth(): Promise<void> {
    try {
      if (!localStorage.getItem('token'))
        return
        
      const response = await AuthAPI.refresh()
      localStorage.setItem('token', response.data.accessToken)

      user.value = response.data.user
    } catch {
      await logout()
    }
  }

  async function logout(): Promise<void> {
    try {
      localStorage.removeItem('token')
      await AuthAPI.logout()
      user.value = null

      localStorage.removeItem('newUser')
    } catch {}
  }

  async function updateUser(new_user: any) {
    try {
      user.value = (await AuthAPI.updateUser(new_user)).data
    } catch {}
  }

  return { user, registration, login, checkAuth, logout, updateUser }
})
