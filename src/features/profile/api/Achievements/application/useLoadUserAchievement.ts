import { useCallback } from 'react'

import { useAchievementDependencies } from 'features/profile/api/Achievements/AchievementContext'
import { userAchievementsStore } from 'features/profile/api/Achievements/stores/user-achievements.store'

export const useLoadUserAchievement = () => {
  const { achievementGateway } = useAchievementDependencies()
  const {
    actions: { setCompletedAchievements },
  } = userAchievementsStore()
  const loadUserAchievements = useCallback(async () => {
    const userAchievements = await achievementGateway.getCompletedAchievements()
    setCompletedAchievements(userAchievements)
  }, [achievementGateway, setCompletedAchievements])

  return {
    loadUserAchievements,
  }
}
