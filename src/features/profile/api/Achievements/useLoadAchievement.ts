import { useAchievementDependencies } from 'features/profile/api/Achievements/AchievementContext'
import { achievementsStore } from 'features/profile/api/Achievements/achievements.store'

export const useLoadAchievement = () => {
  const { achievementGateway } = useAchievementDependencies()
  const {
    actions: { setAchievements },
  } = achievementsStore()
  return {
    loadAchievements: async () => {
      const achievements = await achievementGateway.getAll()
      setAchievements(achievements)
    },
  }
}
