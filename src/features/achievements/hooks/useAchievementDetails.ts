import { AchievementEnum } from 'api/gen'
import { achievementData } from 'features/achievements/data/AchievementData'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { analytics } from 'libs/analytics/provider'

export const useAchievementDetails = (name: AchievementEnum) => {
  const { user } = useAuthContext()
  const achievement = achievementData.find((achievement) => achievement.name === name)
  const completedAchievement = user?.achievements.find(
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

  const unlockedDate = completedAchievement?.unlockedDate

  return {
    title: achievement.title,
    description: completed ? achievement.descriptionUnlocked : achievement.descriptionLocked,
    illustration: completed
      ? achievement.illustrationUnlockedDetailed
      : achievement.illustrationLockedDetailed,
    completedAt: unlockedDate ? new Date(unlockedDate).toLocaleDateString('fr-FR') : undefined,
    completed,
    track,
  }
}
