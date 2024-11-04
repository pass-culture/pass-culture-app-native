import { Achievement, UserAchievement } from 'features/profile/pages/Achievements/AchievementData'

export type AchievementGateway = {
  getAll(): Promise<Achievement[]>
  getCompletedAchievements(): Promise<UserAchievement[]>
  onAchievementCompleted(callback: (achievementId: string) => void): void
}
