import React from 'react'

import { AchievementProvider } from 'features/profile/api/Achievements/AchievementContext'
import { useLoadUserAchievement } from 'features/profile/api/Achievements/application/useLoadUserAchievement'
import { createFakeAchievementGateway } from 'features/profile/api/Achievements/infra/FakeAchievementGateway'
import { userAchievementsStore } from 'features/profile/api/Achievements/stores/user-achievements.store'
import { renderHook, waitFor } from 'tests/utils'

describe('useLoadUserAchievement', () => {
  it('should load user achievements', async () => {
    const userAchievements = [
      {
        id: 'FIRST_ADD_FAVORITE',
        completedAt: new Date('2024-09-24'),
      },
    ]

    const fakeAchievementGateway = createFakeAchievementGateway()
    fakeAchievementGateway.givenCompletedAchievements(userAchievements)

    const render = renderHook(useLoadUserAchievement, {
      wrapper: ({ children }) => (
        <AchievementProvider achievementGateway={fakeAchievementGateway}>
          {children}
        </AchievementProvider>
      ),
    })
    const { loadUserAchievements } = render.result.current

    await waitFor(() => {
      loadUserAchievements()
    })

    expect(userAchievementsStore.getState().completedAchievements).toEqual(userAchievements)
  })
})