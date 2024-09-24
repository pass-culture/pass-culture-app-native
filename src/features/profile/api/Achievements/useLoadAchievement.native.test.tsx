import React from 'react'

import { AchievementProvider } from 'features/profile/api/Achievements/AchievementContext'
import { achievementsStore } from 'features/profile/api/Achievements/achievements.store'
import { createFakeAchievementGateway } from 'features/profile/api/Achievements/FakeAchievementGateway'
import { useLoadAchievement } from 'features/profile/api/Achievements/useLoadAchievement'
import { renderHook, waitFor } from 'tests/utils'

describe('useLoadAchievement', () => {
  it('should load achievements', async () => {
    const achievements = [
      {
        id: 'FIRST_ADD_FAVORITE',
        name: 'Add a favorite',
        description: 'Add your first favorite',
        category: 'Favorites',
        icon: 'Info',
      },
    ]
    const fakeAchievementGateway = createFakeAchievementGateway()
    fakeAchievementGateway.givenAchievements(achievements)

    const render = renderHook(useLoadAchievement, {
      wrapper: ({ children }) => (
        <AchievementProvider achievementGateway={fakeAchievementGateway}>
          {children}
        </AchievementProvider>
      ),
    })
    const { loadAchievements } = render.result.current

    await waitFor(() => {
      loadAchievements()
    })

    expect(achievementsStore.getState().achievements).toEqual(achievements)
  })
})
