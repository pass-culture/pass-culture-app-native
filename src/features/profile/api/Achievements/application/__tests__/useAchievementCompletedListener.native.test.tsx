import { createFakeAchievementGateway } from '../../infra/FakeAchievementGateway'
import { createFakeAchievementNotifier } from '../../infra/FakeAchievementNotifier'
import { achievementCompletedListener } from '../achievementCompletedListener'

describe('useAchievementCompletedListener', () => {
  test('User is notified', () => {
    const fakeAchievementNotifier = createFakeAchievementNotifier()
    const fakeAchievementGateway = createFakeAchievementGateway()

    achievementCompletedListener(fakeAchievementGateway, fakeAchievementNotifier)

    fakeAchievementGateway.simulateCompletedAchievement({
      id: 'FIRST_ACHIEVEMENT',
      completedAt: new Date('2024-09-25'),
    })

    expect(fakeAchievementNotifier.getLastNotifyWith()).toEqual('FIRST_ACHIEVEMENT')
  })
})
