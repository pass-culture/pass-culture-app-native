import { AchievementEnum } from 'api/gen'
import {
  mockAchievements,
  mockCompletedAchievements,
} from 'features/profile/pages/Achievements/AchievementData'
import { analytics } from 'libs/analytics'

export const useAchievementDetails = (name: AchievementEnum) => {
  const achievement = mockAchievements.find((achievement) => achievement.name === name)
  const completedAchievement = mockCompletedAchievements.find(
    (userAchievement) => userAchievement.name === name
  )

  if (!achievement) return

  const completed = !!completedAchievement

  const track = () => {
    analytics.logConsultAchievementModal({
      achievementName: name,
      state: completed ? 'unlocked' : 'locked',
    })
  }

  return {
    title: achievement.title,
    description: completed ? achievement.descriptionUnlocked : achievement.descriptionLocked,
    illustration: completed
      ? achievement.illustrationUnlockedDetailed
      : achievement.illustrationLockedDetailed,
    completedAt: completedAchievement?.unlockedDate.toLocaleDateString('fr-FR'),
    completed,
    track,
  }
}
