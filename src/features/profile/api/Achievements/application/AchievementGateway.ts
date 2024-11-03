import { Achievement } from 'features/profile/api/Achievements/stores/achievements.store'
import { UserAchievement } from 'features/profile/api/Achievements/stores/user-achievements.store'

export type AchievementGateway = {
  getAll(): Promise<Achievement[]>
  getCompletedAchievements(): Promise<UserAchievement[]>
  onAchievementCompleted(callback: (achievementId: string) => void): void
}
