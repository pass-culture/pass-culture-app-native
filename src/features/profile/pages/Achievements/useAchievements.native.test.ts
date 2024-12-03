import {
  Achievement,
  AchievementCategory,
  AchievementId,
  firstArtLessonBooking,
  firstBookBooking,
  firstInstrumentBooking,
  firstMovieBooking,
  userCompletedArtLessonBooking,
  userCompletedBookBooking,
  userCompletedMovieBooking,
} from 'features/profile/pages/Achievements/AchievementData'
import {
  UseAchivementsProps,
  useAchievements,
} from 'features/profile/pages/Achievements/useAchievements'
import { analytics } from 'libs/analytics/__mocks__/provider'
import { renderHook } from 'tests/utils'
import { FirstArtLessonBookingLocked } from 'ui/svg/icons/achievements/Simple/FirstArtLessonBookingLocked'
import { FirstArtLessonBookingUnlocked } from 'ui/svg/icons/achievements/Simple/FirstArtLessonBookingUnlocked'

enum TestAchievementCategory {
  TEST = 'TEST',
}
enum TestAchievementId {
  TEST = 'TEST',
}

const CombinedAchievementId = {
  ...AchievementId,
  ...TestAchievementId,
} as const

const CombinedAchievementCategory = {
  ...TestAchievementCategory,
  ...AchievementCategory,
} as const

const testAchievement = {
  id: CombinedAchievementId.TEST,
  name: 'Test',
  descriptionLocked: 'Test',
  descriptionUnlocked: 'Test',
  illustrationLocked: FirstArtLessonBookingLocked,
  illustrationUnlocked: FirstArtLessonBookingUnlocked,
  category: CombinedAchievementCategory.TEST,
}

const testUseAchievements = ({
  achievements = [],
  completedAchievements = [],
}: Partial<UseAchivementsProps> = {}) =>
  renderHook(() =>
    useAchievements({
      achievements,
      completedAchievements,
    })
  ).result.current

describe('useAchievements', () => {
  it('should return empty array when there are no achievements', () => {
    const { categories } = testUseAchievements()

    expect(categories).toEqual([])
  })

  it('should return achievements grouped by category', () => {
    const { categories } = testUseAchievements({
      achievements: [firstArtLessonBooking, testAchievement as unknown as Achievement],
    })

    expect(categories).toEqual([
      expect.objectContaining({
        id: CombinedAchievementCategory.FIRST_BOOKINGS,
        badges: [
          expect.objectContaining({
            id: CombinedAchievementId.FIRST_ART_LESSON_BOOKING,
          }),
        ],
      }),
      expect.objectContaining({
        id: CombinedAchievementCategory.TEST,
        badges: [
          expect.objectContaining({
            id: 'TEST',
          }),
        ],
      }),
    ])
  })

  it('achievement is NOT completed when user has not already completed it', () => {
    const { categories } = testUseAchievements({
      achievements: [firstArtLessonBooking, firstBookBooking],
    })

    expect(categories).toEqual([
      expect.objectContaining({
        id: CombinedAchievementCategory.FIRST_BOOKINGS,
        badges: [
          expect.objectContaining({
            id: CombinedAchievementId.FIRST_ART_LESSON_BOOKING,
            isCompleted: false,
          }),
          expect.objectContaining({
            id: CombinedAchievementId.FIRST_BOOK_BOOKING,
            isCompleted: false,
          }),
        ],
      }),
    ])
  })

  it('achievement is completed when user has already completed it', () => {
    const { categories } = testUseAchievements({
      achievements: [firstArtLessonBooking, firstBookBooking],
      completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
    })

    expect(categories).toEqual([
      expect.objectContaining({
        id: CombinedAchievementCategory.FIRST_BOOKINGS,
        badges: [
          expect.objectContaining({
            id: CombinedAchievementId.FIRST_BOOK_BOOKING,
            isCompleted: true,
          }),
          expect.objectContaining({
            id: CombinedAchievementId.FIRST_ART_LESSON_BOOKING,
            isCompleted: true,
          }),
        ],
      }),
    ])
  })

  it('achievement name is "Badge non débloqué" when achievement is not completed', () => {
    const { categories } = testUseAchievements({
      achievements: [firstArtLessonBooking, firstBookBooking],
      completedAchievements: [],
    })

    expect(categories).toEqual([
      expect.objectContaining({
        id: CombinedAchievementCategory.FIRST_BOOKINGS,
        badges: [
          expect.objectContaining({
            id: CombinedAchievementId.FIRST_ART_LESSON_BOOKING,
            name: 'Badge non débloqué',
          }),
          expect.objectContaining({
            id: CombinedAchievementId.FIRST_BOOK_BOOKING,
            name: 'Badge non débloqué',
          }),
        ],
      }),
    ])
  })

  it('achievement completed name is the achievement name', () => {
    const { categories } = testUseAchievements({
      achievements: [firstArtLessonBooking, firstBookBooking],
      completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
    })

    expect(categories).toEqual([
      expect.objectContaining({
        id: CombinedAchievementCategory.FIRST_BOOKINGS,
        badges: [
          expect.objectContaining({
            id: CombinedAchievementId.FIRST_BOOK_BOOKING,
            name: firstBookBooking.name,
          }),
          expect.objectContaining({
            id: CombinedAchievementId.FIRST_ART_LESSON_BOOKING,
            name: firstArtLessonBooking.name,
          }),
        ],
      }),
    ])
  })

  it('achivements are sorted by name', () => {
    const { categories } = testUseAchievements({
      achievements: [firstArtLessonBooking, firstBookBooking],
      completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
    })

    expect(categories).toEqual([
      expect.objectContaining({
        id: CombinedAchievementCategory.FIRST_BOOKINGS,
        badges: [
          expect.objectContaining({
            id: CombinedAchievementId.FIRST_BOOK_BOOKING,
          }),
          expect.objectContaining({
            id: CombinedAchievementId.FIRST_ART_LESSON_BOOKING,
          }),
        ],
      }),
    ])
  })

  it('achievement completed is sorted before achievement not completed', () => {
    const { categories } = testUseAchievements({
      achievements: [firstBookBooking, firstArtLessonBooking],
      completedAchievements: [userCompletedArtLessonBooking],
    })

    expect(categories).toEqual([
      expect.objectContaining({
        id: CombinedAchievementCategory.FIRST_BOOKINGS,
        badges: [
          expect.objectContaining({
            id: CombinedAchievementId.FIRST_ART_LESSON_BOOKING,
          }),
          expect.objectContaining({
            id: CombinedAchievementId.FIRST_BOOK_BOOKING,
          }),
        ],
      }),
    ])
  })

  describe('Category Achievements completion', () => {
    describe('Remaining achievements to complete', () => {
      it('should return "0 badge restant" when all achievements of category are completed', () => {
        const { categories } = testUseAchievements({
          achievements: [firstArtLessonBooking, firstBookBooking],
          completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
        })

        expect(categories).toEqual([
          expect.objectContaining({
            id: CombinedAchievementCategory.FIRST_BOOKINGS,
            remainingAchievementsText: '0 badge restant',
          }),
        ])
      })

      it('should return "1 badge restants" when 1 achievement are not completed', () => {
        const { categories } = testUseAchievements({
          achievements: [firstArtLessonBooking, firstBookBooking],
          completedAchievements: [userCompletedArtLessonBooking],
        })

        expect(categories).toEqual([
          expect.objectContaining({
            id: CombinedAchievementCategory.FIRST_BOOKINGS,
            remainingAchievementsText: '1 badge restant',
          }),
        ])
      })

      it('should return "2 badges restants" when 2 achievement are not completed', () => {
        const { categories } = testUseAchievements({
          achievements: [firstArtLessonBooking, firstBookBooking],
        })

        expect(categories).toEqual([
          expect.objectContaining({
            id: CombinedAchievementCategory.FIRST_BOOKINGS,
            remainingAchievementsText: '2 badges restant',
          }),
        ])
      })
    })

    describe('Achievements progression', () => {
      it('should be 1 when all achievements are completed', () => {
        const { categories } = testUseAchievements({
          achievements: [firstArtLessonBooking],
          completedAchievements: [userCompletedArtLessonBooking],
        })

        expect(categories).toEqual([
          expect.objectContaining({
            id: CombinedAchievementCategory.FIRST_BOOKINGS,
            progress: 1,
          }),
        ])
      })

      it('should be 0 when no achievements are completed', () => {
        const { categories } = testUseAchievements({
          achievements: [firstArtLessonBooking],
        })

        expect(categories).toEqual([
          expect.objectContaining({
            id: CombinedAchievementCategory.FIRST_BOOKINGS,
            progress: 0,
          }),
        ])
      })

      it('should be 0.5 when 1 achievement of 2 are completed', () => {
        const { categories } = testUseAchievements({
          achievements: [firstArtLessonBooking, firstBookBooking],
          completedAchievements: [userCompletedArtLessonBooking],
        })

        expect(categories).toEqual([
          expect.objectContaining({
            id: CombinedAchievementCategory.FIRST_BOOKINGS,
            progress: 0.5,
          }),
        ])
      })

      it('should be 0.75 when 3 achievement of 4 are completed', () => {
        const { categories } = testUseAchievements({
          achievements: [
            firstArtLessonBooking,
            firstBookBooking,
            firstInstrumentBooking,
            firstMovieBooking,
          ],
          completedAchievements: [
            userCompletedArtLessonBooking,
            userCompletedBookBooking,
            userCompletedMovieBooking,
          ],
        })

        expect(categories).toEqual([
          expect.objectContaining({
            id: CombinedAchievementCategory.FIRST_BOOKINGS,
            progress: 0.75,
          }),
        ])
      })

      describe('text', () => {
        it('should return 0/2 when no achievements are completed', () => {
          const { categories } = testUseAchievements({
            achievements: [firstArtLessonBooking, firstBookBooking],
          })

          expect(categories).toEqual([
            expect.objectContaining({
              id: CombinedAchievementCategory.FIRST_BOOKINGS,
              progressText: '0/2',
            }),
          ])
        })

        it('should return 2/2 when all achievements are completed', () => {
          const { categories } = testUseAchievements({
            achievements: [firstArtLessonBooking, firstBookBooking],
            completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
          })

          expect(categories).toEqual([
            expect.objectContaining({
              id: CombinedAchievementCategory.FIRST_BOOKINGS,
              progressText: '2/2',
            }),
          ])
        })

        it('should return 1/2 when 1 achievement of 2 are completed', () => {
          const { categories } = testUseAchievements({
            achievements: [firstArtLessonBooking, firstBookBooking],
            completedAchievements: [userCompletedArtLessonBooking],
          })

          expect(categories).toEqual([
            expect.objectContaining({
              id: CombinedAchievementCategory.FIRST_BOOKINGS,
              progressText: '1/2',
            }),
          ])
        })
      })
    })
  })

  describe('Tracking', () => {
    describe('From', () => {
      it.each`
        from
        ${'profile'}
        ${'success'}
      `('send DisplayAchievements event with from $from when track from $from', ({ from }) => {
        const { track } = testUseAchievements()

        track(from)

        expect(analytics.logDisplayAchievements).toHaveBeenCalledWith(
          expect.objectContaining({ from })
        )
      })
    })
  })

  describe('Number unlocked', () => {
    it('send 0 when no achievements are completed', () => {
      const { track } = testUseAchievements()

      track('profile')

      expect(analytics.logDisplayAchievements).toHaveBeenCalledWith(
        expect.objectContaining({ numberUnlocked: 0 })
      )
    })

    it('send 2 when 2 achievement are completed', () => {
      const { track } = testUseAchievements({
        achievements: [firstArtLessonBooking, firstBookBooking],
        completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
      })

      track('profile')

      expect(analytics.logDisplayAchievements).toHaveBeenCalledWith(
        expect.objectContaining({ numberUnlocked: 2 })
      )
    })
  })
})
