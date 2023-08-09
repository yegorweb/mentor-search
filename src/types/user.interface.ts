import { Achievement } from "./achievement.type"
import { Contact } from "./contact.type"
import School from "./school.interface"
import Town from "./town.interface"

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
  town: Town
  school: School
  date: number
  roles: string[]
}
