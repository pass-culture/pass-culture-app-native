import { useCallback } from 'react'

import { useAchievementDependencies } from 'features/profile/api/Achievements/AchievementContext'

export const useLoadUserAchievement = () => {
  const { achievementGateway } = useAchievementDependencies()

  const loadUserAchievements = useCallback(async () => {
    await achievementGateway.getCompletedAchievements()
  }, [achievementGateway])

  return {
    loadUserAchievements,
  }
}
