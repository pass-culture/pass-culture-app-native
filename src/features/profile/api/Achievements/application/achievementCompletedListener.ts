import { AchievementGateway } from './AchievementGateway'
import { AchievementNotifier } from './AchievementNotifier'

export const achievementCompletedListener = (
  achievementGateway: AchievementGateway,
  achievementNotifier: AchievementNotifier
) => {
  achievementGateway.onAchievementCompleted((achievementId) => {
    achievementNotifier.notify(achievementId)
  })
}
