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

  const completed = !!completedAchievement

  return {
    name: achievement.name,
    description: completed ? achievement.descriptionUnlocked : achievement.descriptionLocked,
    illustration: completed ? achievement.illustrationUnlocked : achievement.illustrationLocked,
    completedAt: completedAchievement?.completedAt.toLocaleDateString(),
    completed,
  }
}
