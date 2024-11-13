import {
  mockAchievements,
  mockCompletedAchievements,
} from 'features/profile/pages/Achievements/AchievementData'

export const useAchievementDetails = (id: string) => {
  const achievement = mockAchievements.find((achievement) => achievement.id === id)
  const completedAchievement = mockCompletedAchievements.find(
    (userAchievement) => userAchievement.id === id
  )

  if (!achievement) return

  return {
    name: achievement.name,
    description: achievement.description,
    illustrationUnlocked: achievement.illustrationUnlocked,
    illustrationLocked: achievement.illustrationLocked,
    completedAt: completedAchievement?.completedAt.toLocaleDateString(),
    completed: !!completedAchievement,
  }
}
