import { achievementsStore } from 'features/profile/pages/Achivements/achivements.store'
import { useAchievements } from 'features/profile/pages/Achivements/useAchievements'
import { userAchievementsStore } from 'features/profile/pages/Achivements/user-achivements.store'
import { renderHook } from 'tests/utils'

const FIRST_ADD_FAVORITE = {
  id: 'FIRST_ADD_FAVORITE',
  name: 'First favorite',
  description: 'Add your first favorite',
  category: 'Favorites',
  icon: 'Info',
}

const SECOND_ADD_FAVORITE = {
  id: 'SECOND_ADD_FAVORITE',
  name: 'Second favorite',
  description: 'Add your second favorite',
  category: 'Favorites',
  icon: 'Info',
}

const FIRST_WATCH_MOVIE = {
  id: 'FIRST_WATCH_MOVIE',
  name: 'First movie',
  description: 'Watch your first movie',
  category: 'Cinema',
  icon: 'Info',
}

describe('useAchievements', () => {
  it('should return empty array when there are no achievements', () => {
    achievementsStore.setState({
      achievements: [],
    })
    const render = renderHook(useAchievements)
    const { badges } = render.result.current

    expect(badges).toEqual([])
  })

  it('should return achievements grouped by category', () => {
    achievementsStore.setState({
      achievements: [FIRST_ADD_FAVORITE, SECOND_ADD_FAVORITE, FIRST_WATCH_MOVIE],
    })
    const render = renderHook(useAchievements)
    const { badges } = render.result.current

    expect(badges).toEqual([
      {
        category: 'Favorites',
        achievements: [
          expect.objectContaining({
            id: 'FIRST_ADD_FAVORITE',
            name: 'First favorite',
            description: 'Add your first favorite',
            icon: 'Info',
          }),
          expect.objectContaining({
            id: 'SECOND_ADD_FAVORITE',
            name: 'Second favorite',
            description: 'Add your second favorite',
            icon: 'Info',
          }),
        ],
      },
      {
        category: 'Cinema',
        achievements: [
          expect.objectContaining({
            id: 'FIRST_WATCH_MOVIE',
            name: 'First movie',
            description: 'Watch your first movie',
            icon: 'Info',
          }),
        ],
      },
    ])
  })

  it('achievement is NOT completed when user has not already completed it', () => {
    achievementsStore.setState({
      achievements: [FIRST_ADD_FAVORITE, SECOND_ADD_FAVORITE],
    })

    const render = renderHook(useAchievements)
    const { badges } = render.result.current

    expect(badges).toEqual([
      {
        category: 'Favorites',
        achievements: [
          expect.objectContaining({
            id: 'FIRST_ADD_FAVORITE',
            isCompleted: false,
          }),
          expect.objectContaining({
            id: 'SECOND_ADD_FAVORITE',
            isCompleted: false,
          }),
        ],
      },
    ])
  })

  it('achievement is completed when user has already completed it', () => {
    achievementsStore.setState({
      achievements: [FIRST_ADD_FAVORITE, SECOND_ADD_FAVORITE],
    })

    userAchievementsStore.setState({
      completedAchievements: [
        {
          id: 'FIRST_ADD_FAVORITE',
          completedAt: new Date(),
        },
        {
          id: 'SECOND_ADD_FAVORITE',
          completedAt: new Date(),
        },
      ],
    })

    const render = renderHook(useAchievements)
    const { badges } = render.result.current

    expect(badges).toEqual([
      {
        category: 'Favorites',
        achievements: [
          expect.objectContaining({
            id: 'FIRST_ADD_FAVORITE',
            isCompleted: true,
          }),
          expect.objectContaining({
            id: 'SECOND_ADD_FAVORITE',
            isCompleted: true,
          }),
        ],
      },
    ])
  })
})
