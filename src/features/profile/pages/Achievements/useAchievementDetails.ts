import {
  mockAchievements,
  mockCompletedAchievements,
} from 'features/profile/pages/Achievements/AchievementData'

export const useAchievementDetails = (id: string) => {
  const achievement = mockAchievements.find((achievement) => achievement.id === id)
  const completedAchievement = mockCompletedAchievements.find((u) => u.id === id)

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
