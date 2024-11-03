import { AchievementNotifier } from 'features/profile/api/Achievements/application/AchievementNotifier'

export const createModalAchievementNotifier = (
  showAchievementModal: (id: string) => void
): AchievementNotifier => {
  return {
    notify: (achievementId: string) => {
      showAchievementModal(achievementId)
    },
  }
}
