import {
  AchievementId,
  mockAchievements,
  mockCompletedAchievements,
} from 'features/profile/pages/Achievements/AchievementData'

export const useAchievementDetails = (id: AchievementId) => {
  const achievement = mockAchievements.find((achievement) => achievement.id === id)
  const completedAchievement = mockCompletedAchievements.find(
    (userAchievement) => userAchievement.id === id
  )

  if (!achievement) return

  return {
    name: achievement.name,
    descriptionLocked: achievement.descriptionLocked,
    descriptionUnlocked: achievement.descriptionUnlocked,
    illustrationUnlocked: achievement.illustrationUnlocked,
    illustrationLocked: achievement.illustrationLocked,
    completedAt: completedAchievement?.completedAt.toLocaleDateString(),
    completed: !!completedAchievement,
  }
}
