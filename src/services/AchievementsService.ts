import { Achievement } from "../types/achievement.type";

export default {
  getActiveAchievements(achievements: Achievement[]): Achievement[] {
    return achievements.filter(achiev => 
      achiev.forever || 
      (achiev.duration && 
      (achiev.date+achiev.duration) > Date.now())
    )
  }
}
