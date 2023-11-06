import { Achievement } from "./achievement.type"
import { Contact } from "./contact.type"
import School from "./school.interface"

export interface User {
  _id: string
  name: string
  email: string
  password: string
  description?: string
  avatar_url?: string
  ranks: string[]
  achievements: Achievement[]
  contacts: Contact[]
  grade: number
  school: School
  date: number
  roles: string[]
}
