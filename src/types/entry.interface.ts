import { EntryType } from "./entry_types"
import School from "./school.interface"
import Town from "./town.interface"
import { User } from "./user.interface"

export default interface Entry {
  _id: string
  type: EntryType
  subject: string
  description: string
  author: User
  responses: string[]
  banned: string[]
  town: Town
  school: School
  date: number
  limit?: number
  on_moderation: boolean
  moderation_result?: boolean
}