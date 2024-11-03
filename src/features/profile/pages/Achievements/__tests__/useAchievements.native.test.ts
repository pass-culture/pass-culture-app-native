import { achievementsStore } from 'features/profile/api/Achievements/stores/achievements.store'
import { userAchievementsStore } from 'features/profile/api/Achievements/stores/user-achievements.store'
import { useAchievements } from 'features/profile/pages/Achievements/useAchievements'
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

const THIRD_ADD_FAVORITE = {
  id: 'THIRD_ADD_FAVORITE',
  name: 'Third favorite',
  description: 'Add your third favorite',
  category: 'Favorites',
  icon: 'Info',
}

const FOURTH_ADD_FAVORITE = {
  id: 'FOURTH_ADD_FAVORITE',
  name: 'Fourth favorite',
  description: 'Add your fourth favorite',
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
      expect.objectContaining({
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
      }),
      expect.objectContaining({
        category: 'Cinema',
        achievements: [
          expect.objectContaining({
            id: 'FIRST_WATCH_MOVIE',
            name: 'First movie',
            description: 'Watch your first movie',
            icon: 'Info',
          }),
        ],
      }),
    ])
  })

  it('achievement is NOT completed when user has not already completed it', () => {
    achievementsStore.setState({
      achievements: [FIRST_ADD_FAVORITE, SECOND_ADD_FAVORITE],
    })
    userAchievementsStore.setState({
      completedAchievements: [],
    })

    const render = renderHook(useAchievements)
    const { badges } = render.result.current

    expect(badges).toEqual([
      expect.objectContaining({
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
      }),
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
      expect.objectContaining({
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
      }),
    ])
  })

  describe('Category Achievements completion', () => {
    describe('Remaining achievements to complete', () => {
      it('should return 2 when there are 2 achievements and no one is completed', () => {
        achievementsStore.setState({
          achievements: [FIRST_ADD_FAVORITE, SECOND_ADD_FAVORITE],
        })
        userAchievementsStore.setState({
          completedAchievements: [],
        })

        const render = renderHook(useAchievements)
        const { badges } = render.result.current

        expect(badges).toEqual([
          expect.objectContaining({
            category: 'Favorites',
            remainingAchievements: 2,
          }),
        ])
      })

      it('should return 1 when only 1 achievement is remaining', () => {
        achievementsStore.setState({
          achievements: [FIRST_ADD_FAVORITE, SECOND_ADD_FAVORITE],
        })
        userAchievementsStore.setState({
          completedAchievements: [{ id: FIRST_ADD_FAVORITE.id, completedAt: new Date() }],
        })

        const render = renderHook(useAchievements)
        const { badges } = render.result.current

        expect(badges).toEqual([
          expect.objectContaining({
            category: 'Favorites',
            remainingAchievements: 1,
          }),
        ])
      })

      it('should return 0 when all achievement is completed', () => {
        achievementsStore.setState({
          achievements: [FIRST_ADD_FAVORITE],
        })
        userAchievementsStore.setState({
          completedAchievements: [{ id: FIRST_ADD_FAVORITE.id, completedAt: new Date() }],
        })

        const render = renderHook(useAchievements)
        const { badges } = render.result.current

        expect(badges).toEqual([
          expect.objectContaining({
            category: 'Favorites',
            remainingAchievements: 0,
          }),
        ])
      })
    })

    describe('Achievements progression', () => {
      it('should be 1 when all achievements are completed', () => {
        achievementsStore.setState({
          achievements: [FIRST_ADD_FAVORITE],
        })
        userAchievementsStore.setState({
          completedAchievements: [{ id: FIRST_ADD_FAVORITE.id, completedAt: new Date() }],
        })

        const render = renderHook(useAchievements)
        const { badges } = render.result.current

        expect(badges).toEqual([
          expect.objectContaining({
            category: 'Favorites',
            progress: 1,
          }),
        ])
      })

      it('should be 0 when no achievements are completed', () => {
        achievementsStore.setState({
          achievements: [FIRST_ADD_FAVORITE],
        })
        userAchievementsStore.setState({
          completedAchievements: [],
        })

        const render = renderHook(useAchievements)
        const { badges } = render.result.current

        expect(badges).toEqual([
          expect.objectContaining({
            category: 'Favorites',
            progress: 0,
          }),
        ])
      })

      it('should be 0.5 when 1 achievement of 2 are completed', () => {
        achievementsStore.setState({
          achievements: [FIRST_ADD_FAVORITE, SECOND_ADD_FAVORITE],
        })
        userAchievementsStore.setState({
          completedAchievements: [{ id: FIRST_ADD_FAVORITE.id, completedAt: new Date() }],
        })

        const render = renderHook(useAchievements)
        const { badges } = render.result.current

        expect(badges).toEqual([
          expect.objectContaining({
            category: 'Favorites',
            progress: 0.5,
          }),
        ])
      })

      it('should be 0.75 when 2 achievement of 4 are completed', () => {
        achievementsStore.setState({
          achievements: [
            FIRST_ADD_FAVORITE,
            SECOND_ADD_FAVORITE,
            THIRD_ADD_FAVORITE,
            FOURTH_ADD_FAVORITE,
          ],
        })
        userAchievementsStore.setState({
          completedAchievements: [
            { id: FIRST_ADD_FAVORITE.id, completedAt: new Date() },
            { id: SECOND_ADD_FAVORITE.id, completedAt: new Date() },
            { id: THIRD_ADD_FAVORITE.id, completedAt: new Date() },
          ],
        })

        const render = renderHook(useAchievements)
        const { badges } = render.result.current

        expect(badges).toEqual([
          expect.objectContaining({
            category: 'Favorites',
            progress: 0.75,
          }),
        ])
      })

      describe('text', () => {
        it('should return 0% when no achievements are completed', () => {
          achievementsStore.setState({
            achievements: [FIRST_ADD_FAVORITE],
          })
          userAchievementsStore.setState({
            completedAchievements: [],
          })

          const render = renderHook(useAchievements)
          const { badges } = render.result.current

          expect(badges).toEqual([
            expect.objectContaining({
              category: 'Favorites',
              progressText: '0%',
            }),
          ])
        })

        it('should return 100% when all achievements are completed', () => {
          achievementsStore.setState({
            achievements: [FIRST_ADD_FAVORITE],
          })
          userAchievementsStore.setState({
            completedAchievements: [{ id: FIRST_ADD_FAVORITE.id, completedAt: new Date() }],
          })

          const render = renderHook(useAchievements)
          const { badges } = render.result.current

          expect(badges).toEqual([
            expect.objectContaining({
              category: 'Favorites',
              progressText: '100%',
            }),
          ])
        })

        it('should return 50% when 1 achievement of 2 are completed', () => {
          achievementsStore.setState({
            achievements: [FIRST_ADD_FAVORITE, SECOND_ADD_FAVORITE],
          })
          userAchievementsStore.setState({
            completedAchievements: [{ id: FIRST_ADD_FAVORITE.id, completedAt: new Date() }],
          })

          const render = renderHook(useAchievements)
          const { badges } = render.result.current

          expect(badges).toEqual([
            expect.objectContaining({
              category: 'Favorites',
              progressText: '50%',
            }),
          ])
        })

        it('should return 33% when 1 achievement of 3 are completed', () => {
          achievementsStore.setState({
            achievements: [FIRST_ADD_FAVORITE, SECOND_ADD_FAVORITE, THIRD_ADD_FAVORITE],
          })
          userAchievementsStore.setState({
            completedAchievements: [{ id: FIRST_ADD_FAVORITE.id, completedAt: new Date() }],
          })

          const render = renderHook(useAchievements)
          const { badges } = render.result.current

          expect(badges).toEqual([
            expect.objectContaining({
              category: 'Favorites',
              progressText: '33%',
            }),
          ])
        })
      })
    })
  })
})
