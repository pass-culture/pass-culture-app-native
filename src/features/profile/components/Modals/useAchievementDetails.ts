import {
  AchievementId,
  mockAchievements,
  mockCompletedAchievements,
} from 'features/profile/pages/Achievements/AchievementData'
import { analytics } from 'libs/analytics'

export const useAchievementDetails = (id: AchievementId) => {
  const achievement = mockAchievements.find((achievement) => achievement.id === id)
  const completedAchievement = mockCompletedAchievements.find(
    (userAchievement) => userAchievement.id === id
  )

  if (!achievement) return

  const completed = !!completedAchievement

  const track = () => {
    analytics.logConsultAchievementModal({
      achievementName: id,
      state: completed ? 'unlocked' : 'locked',
    })
  }

  return {
    name: achievement.name,
    description: completed ? achievement.descriptionUnlocked : achievement.descriptionLocked,
    illustration: completed
      ? achievement.illustrationUnlockedDetailed
      : achievement.illustrationLockedDetailed,
    completedAt: completedAchievement?.completedAt.toLocaleDateString('fr-FR'),
    completed,
    track,
  }
}
