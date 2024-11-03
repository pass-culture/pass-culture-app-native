import React from 'react'

import { AchievementProvider } from 'features/profile/api/Achievements/AchievementContext'
import { useLoadAchievement } from 'features/profile/api/Achievements/application/useLoadAchievement'
import { AchievementModalProvider } from 'features/profile/api/Achievements/context/AchievementModalProvider'
import { createAchievementGateway } from 'features/profile/api/Achievements/infra/AchievementGateway'
import { achievementsStore } from 'features/profile/api/Achievements/stores/achievements.store'
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
    const fakeAchievementGateway = createAchievementGateway()
    fakeAchievementGateway.givenAchievements(achievements)

    const render = renderHook(useLoadAchievement, {
      wrapper: ({ children }) => (
        <AchievementModalProvider>
          <AchievementProvider achievementGateway={fakeAchievementGateway}>
            {children}
          </AchievementProvider>
        </AchievementModalProvider>
      ),
    })
    const { loadAchievements } = render.result.current

    await waitFor(() => {
      loadAchievements()
    })

    expect(achievementsStore.getState().achievements).toEqual(achievements)
  })
})
