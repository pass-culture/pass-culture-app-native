import { createFakeAchievementGateway } from '../../infra/FakeAchievementGateway'
import { createFakeAchievementNotifier } from '../../infra/FakeAchievementNotifier'
import { achievementCompletedListener } from '../achievementCompletedListener'

describe('useAchievementCompletedListener', () => {
  test('User is notified', () => {
    const fakeAchievementNotifier = createFakeAchievementNotifier()
    const fakeAchievementGateway = createFakeAchievementGateway()

    achievementCompletedListener(fakeAchievementGateway, fakeAchievementNotifier)

    fakeAchievementGateway.simulateCompletedAchievement('FIRST_ACHIEVEMENT')

    expect(fakeAchievementNotifier.getLastNotifyWith()).toEqual('FIRST_ACHIEVEMENT')
  })
})
