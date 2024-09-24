import { useAchievementDependencies } from 'features/profile/api/Achievements/AchievementContext'
import { userAchievementsStore } from 'features/profile/api/Achievements/user-achievements.store'

export const useLoadUserAchievement = () => {
  const { achievementGateway } = useAchievementDependencies()
  const {
    actions: { setCompletedAchievements },
  } = userAchievementsStore()
  return {
    loadUserAchievements: async () => {
      const userAchievements = await achievementGateway.getCompletedAchievements()
      setCompletedAchievements(userAchievements)
    },
  }
}
