import { Achievement } from 'features/profile/api/Achievements/achievements.store'
import { UserAchievement } from 'features/profile/api/Achievements/user-achievements.store'

export type AchievementGateway = {
  getAll(): Promise<Achievement[]>
  getCompletedAchievements(): Promise<UserAchievement[]>
}
