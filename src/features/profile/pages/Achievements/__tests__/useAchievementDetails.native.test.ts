import { achievementsStore } from 'features/profile/api/Achievements/stores/achievements.store'
import { userAchievementsStore } from 'features/profile/api/Achievements/stores/user-achievements.store'
import { useAchievementDetails } from 'features/profile/pages/Achievements/useAchievementDetails'
import { renderHook } from 'tests/utils'

describe('useAchievementDetails', () => {
  it('have achievement details', () => {
    achievementsStore.setState({
      achievements: [
        {
          id: 'FIRST_ADD_FAVORITE',
          name: 'Add a favorite',
          description: 'Add your first favorite',
          category: 'Favorites',
          icon: 'Info',
        },
      ],
    })
    const render = renderHook(() => useAchievementDetails('FIRST_ADD_FAVORITE'))
    const achievementDetails = render.result.current

    expect(achievementDetails).toEqual(
      expect.objectContaining({
        name: 'Add a favorite',
        description: 'Add your first favorite',
        icon: 'Info',
      })
    )
  })

  it('have completedAt when completed', () => {
    const completedAt = new Date('2024-09-24')
    achievementsStore.setState({
      achievements: [
        {
          id: 'FIRST_ADD_FAVORITE',
          name: 'Add a favorite',
          description: 'Add your first favorite',
          category: 'Favorites',
          icon: 'Info',
        },
      ],
    })
    userAchievementsStore.setState({
      completedAchievements: [{ id: 'FIRST_ADD_FAVORITE', completedAt }],
    })
    const render = renderHook(() => useAchievementDetails('FIRST_ADD_FAVORITE'))
    const achievementDetails = render.result.current

    expect(achievementDetails).toEqual(
      expect.objectContaining({
        completedAt: '24/09/2024',
      })
    )
  })

  it('is completed when completed', () => {
    const completedAt = new Date('2024-09-24')
    achievementsStore.setState({
      achievements: [
        {
          id: 'FIRST_ADD_FAVORITE',
          name: 'Add a favorite',
          description: 'Add your first favorite',
          category: 'Favorites',
          icon: 'Info',
        },
      ],
    })
    userAchievementsStore.setState({
      completedAchievements: [{ id: 'FIRST_ADD_FAVORITE', completedAt }],
    })
    const render = renderHook(() => useAchievementDetails('FIRST_ADD_FAVORITE'))
    const achievementDetails = render.result.current

    expect(achievementDetails).toEqual(
      expect.objectContaining({
        completed: true,
      })
    )
  })

  it('is NOT completed when NOT completed', () => {
    achievementsStore.setState({
      achievements: [
        {
          id: 'FIRST_ADD_FAVORITE',
          name: 'Add a favorite',
          description: 'Add your first favorite',
          category: 'Favorites',
          icon: 'Info',
        },
      ],
    })
    userAchievementsStore.setState({
      completedAchievements: [],
    })
    const render = renderHook(() => useAchievementDetails('FIRST_ADD_FAVORITE'))
    const achievementDetails = render.result.current

    expect(achievementDetails).toEqual(
      expect.objectContaining({
        completed: false,
      })
    )
  })
})
