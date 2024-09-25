import EventSource from 'react-native-sse'
import * as yup from 'yup'

import { api } from 'api/api'
import { AchievementGateway } from 'features/profile/api/Achievements/application/AchievementGateway'
import { InMemoryAchievementGateway } from 'features/profile/api/Achievements/infra/InMemoryAchievementGateway'

export const createAPIAchievementGateway = (
  inMemoryAchievementGateway: InMemoryAchievementGateway
): AchievementGateway => {
  let onAchievementCompletedCallback: ((achievementId: string) => void) | undefined

  const sse = new EventSource<'achievementCompleted'>(
    'https://ed71-62-23-224-222.ngrok-free.app/stream'
  )

  sse.addEventListener('achievementCompleted', (e) => {
    const data = yup
      .object({
        achievementSlug: yup.string().required(),
      })
      .validateSync(e.data)

    onAchievementCompletedCallback?.(data.achievementSlug)
  })

  return {
    getAll: async () => {
      return inMemoryAchievementGateway.getAll()
    },
    getCompletedAchievements: async () => {
      const data = await api.getNativeV1AccountAchievements()
      return data.achievements.map((achievement) => ({
        id: achievement.achievement.slug,
        completedAt: new Date(achievement.completionDate),
      }))
    },
    onAchievementCompleted: (callback: (achievementId: string) => void) => {
      onAchievementCompletedCallback = callback
    },
  }
}
