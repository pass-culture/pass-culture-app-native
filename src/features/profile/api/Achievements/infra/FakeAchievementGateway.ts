import { Achievement } from 'features/profile/api/Achievements/stores/achievements.store'
import { UserAchievement } from 'features/profile/api/Achievements/stores/user-achievements.store'

export const createFakeAchievementGateway = () => {
  let achievements: Achievement[] = []
  let completedAchievements: UserAchievement[] = []
  let onAchievementCompletedCallback: ((achievementId: string) => void) | undefined

  return {
    getAll: async () => {
      return achievements
    },
    getCompletedAchievements: async () => {
      return completedAchievements
    },
    onAchievementCompleted: (callback: (achievementId: string) => void) => {
      onAchievementCompletedCallback = callback
    },
    simulateCompletedAchievement: async (achievementId: string) => {
      onAchievementCompletedCallback?.(achievementId)
    },
    givenCompletedAchievements: async (_completedAchievements: UserAchievement[]) => {
      completedAchievements = _completedAchievements
    },
    givenAchievements: async (_achievement: Achievement[]) => {
      achievements = _achievement
    },
  }
}
