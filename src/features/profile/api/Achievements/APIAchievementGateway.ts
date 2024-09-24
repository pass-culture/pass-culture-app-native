import { api } from 'api/api'
import { AchievementGateway } from 'features/profile/api/Achievements/AchievementGateway'
import { InMemoryAchievementGateway } from 'features/profile/api/Achievements/InMemoryAchievementGateway'

export const createAPIAchievementGateway = (
  inMemoryAchievementGateway: InMemoryAchievementGateway
): AchievementGateway => {
  return {
    getAll: async () => {
      return inMemoryAchievementGateway.getAll()
    },
    getCompletedAchievements: async () => {
      const data = await api.getNativeV1AccountAchievements()
      return data.achievements.map((achievement) => ({
        id: achievement.achievement.slug,
        completedAt: new Date(achievement.completionDate),
      }))
    },
  }
}
