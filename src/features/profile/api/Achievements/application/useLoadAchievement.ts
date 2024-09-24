import { useCallback } from 'react'

import { useAchievementDependencies } from 'features/profile/api/Achievements/AchievementContext'
import { achievementsStore } from 'features/profile/api/Achievements/stores/achievements.store'

export const useLoadAchievement = () => {
  const { achievementGateway } = useAchievementDependencies()
  const {
    actions: { setAchievements },
  } = achievementsStore()

  const loadAchievements = useCallback(async () => {
    const achievements = await achievementGateway.getAll()
    setAchievements(achievements)
  }, [achievementGateway, setAchievements])

  return {
    loadAchievements,
  }
}
