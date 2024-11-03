import { createAchievementGateway } from 'features/profile/api/Achievements/infra/AchievementGateway'
import { mockServer } from 'tests/mswServer'

jest.mock('libs/jwt/jwt')

describe('APIAchievementGateway', () => {
  describe('getCompletedAchievement', () => {
    test('should return completed achievements', async () => {
      const achievementsOnRemote = [
        {
          achievement: {
            slug: '1',
            name: 'First achievement',
            description: 'First achievement description',
            icon: 'first-achievement-icon',
            category: 'First achievement category',
          },

          completionDate: '2024-09-24',
        },
        {
          achievement: {
            slug: '2',
            name: 'Second achievement',
            description: 'Second achievement description',
            icon: 'second-achievement-icon',
            category: 'Second achievement category',
          },

          completionDate: '2024-09-25',
        },
      ]

      mockServer.getApi('/v1/account/achievements', {
        achievements: achievementsOnRemote,
      })

      const apiAchievementGateway = createAchievementGateway()

      expect(await apiAchievementGateway.getCompletedAchievements()).toEqual([
        {
          id: '1',
          completedAt: new Date('2024-09-24'),
        },
        {
          id: '2',
          completedAt: new Date('2024-09-25'),
        },
      ])
    })
  })
})
