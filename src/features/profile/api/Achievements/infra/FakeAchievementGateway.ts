import { Achievement } from 'features/profile/api/Achievements/stores/achievements.store'
import { UserAchievement } from 'features/profile/api/Achievements/stores/user-achievements.store'

export const createFakeAchievementGateway = () => {
  let achievements: Achievement[] = []
  let completedAchievements: UserAchievement[] = []
  return {
    getAll: async () => {
      return achievements
    },
    getCompletedAchievements: async () => {
      return completedAchievements
    },
    givenCompletedAchievements: async (_completedAchievements: UserAchievement[]) => {
      completedAchievements = _completedAchievements
    },
    givenAchievements: async (_achievement: Achievement[]) => {
      achievements = _achievement
    },
  }
}
