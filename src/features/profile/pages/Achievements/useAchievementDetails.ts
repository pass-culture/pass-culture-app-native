import { achievementsStore } from 'features/profile/api/Achievements/stores/achievements.store'
import { userAchievementsStore } from 'features/profile/api/Achievements/stores/user-achievements.store'

export const useAchievementDetails = (id: string) => {
  const { achievements } = achievementsStore()
  const { completedAchievements } = userAchievementsStore()

  const achievement = achievements.find((achievement) => achievement.id === id)
  const completedAchievement = completedAchievements.find((u) => u.id === id)

  if (!achievement) {
    return
  }

  return {
    name: achievement.name,
    description: achievement.description,
    icon: achievement.icon,
    completedAt: completedAchievement?.completedAt.toLocaleDateString(),
    completed: !!completedAchievement,
  }
}
