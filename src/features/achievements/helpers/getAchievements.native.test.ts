import { AchievementEnum } from 'api/gen'
import {
  Achievement,
  AchievementCategory,
  firstArtLessonBooking,
  firstBookBooking,
  firstInstrumentBooking,
  firstMovieBooking,
  mockCompletedAchievements,
  userCompletedArtLessonBooking,
  userCompletedBookBooking,
  userCompletedMovieBooking,
} from 'features/achievements/data/AchievementData'
import {
  GetAchivementsParams,
  getAchievements,
} from 'features/achievements/helpers/getAchievements'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/__mocks__/provider'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { FirstArtLessonBookingLocked } from 'ui/svg/icons/achievements/Simple/FirstArtLessonBookingLocked'
import { FirstArtLessonBookingUnlocked } from 'ui/svg/icons/achievements/Simple/FirstArtLessonBookingUnlocked'

jest.mock('features/auth/context/AuthContext')

enum TestAchievementCategory {
  TEST = 'TEST',
}
enum TestAchievementName {
  TEST = 'TEST',
}

const CombinedAchievementName = {
  ...AchievementEnum,
  ...TestAchievementName,
} as const

const CombinedAchievementCategory = {
  ...TestAchievementCategory,
  ...AchievementCategory,
} as const

const testAchievement = {
  id: CombinedAchievementName.TEST,
  name: 'Test',
  descriptionLocked: 'Test',
  descriptionUnlocked: 'Test',
  illustrationLocked: FirstArtLessonBookingLocked,
  illustrationUnlocked: FirstArtLessonBookingUnlocked,
  category: CombinedAchievementCategory.TEST,
}

const testGetAchievements = ({
  achievements = [],
  completedAchievements = [],
}: Partial<GetAchivementsParams> = {}) =>
  getAchievements({
    achievements,
    completedAchievements,
  })

describe('getAchievements', () => {
  beforeEach(() => {
    mockAuthContextWithUser({
      ...beneficiaryUser,
      achievements: mockCompletedAchievements,
    })
  })

  it('should return empty array when there are no achievements', () => {
    const { categories } = testGetAchievements()

    expect(categories).toEqual([])
  })

  it('should return achievements grouped by category', () => {
    const { categories } = testGetAchievements({
      achievements: [firstArtLessonBooking, testAchievement as unknown as Achievement],
    })

    expect(categories).toEqual([
      expect.objectContaining({
        name: CombinedAchievementCategory.FIRST_BOOKINGS,
        achievements: [
          // Make sure you expected achievements are sorted alphabetically
          expect.objectContaining({
            name: CombinedAchievementName.FIRST_ART_LESSON_BOOKING,
          }),
        ],
      }),
      expect.objectContaining({
        name: CombinedAchievementCategory.TEST,
        achievements: [
          // Make sure you expected achievements are sorted alphabetically
          expect.objectContaining({
            name: 'Test',
          }),
        ],
      }),
    ])
  })

  it('achievement is NOT completed when user has not already completed it', () => {
    const { categories } = testGetAchievements({
      achievements: [firstArtLessonBooking, firstBookBooking],
    })

    expect(categories).toEqual([
      expect.objectContaining({
        name: CombinedAchievementCategory.FIRST_BOOKINGS,
        achievements: [
          // Make sure you expected achievements are sorted alphabetically
          expect.objectContaining({
            name: CombinedAchievementName.FIRST_ART_LESSON_BOOKING,
            isCompleted: false,
          }),
          expect.objectContaining({
            name: CombinedAchievementName.FIRST_BOOK_BOOKING,
            isCompleted: false,
          }),
        ],
      }),
    ])
  })

  it('achievement is completed when user has already completed it', () => {
    const { categories } = testGetAchievements({
      achievements: [firstArtLessonBooking, firstBookBooking],
      completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
    })

    expect(categories).toEqual([
      expect.objectContaining({
        name: CombinedAchievementCategory.FIRST_BOOKINGS,
        achievements: [
          // Make sure you expected achievements are sorted alphabetically
          expect.objectContaining({
            name: CombinedAchievementName.FIRST_ART_LESSON_BOOKING,
            isCompleted: true,
          }),
          expect.objectContaining({
            name: CombinedAchievementName.FIRST_BOOK_BOOKING,
            isCompleted: true,
          }),
        ],
      }),
    ])
  })

  it('achievement name is "Succès non débloqué" when achievement is not completed', () => {
    const { categories } = testGetAchievements({
      achievements: [firstArtLessonBooking, firstBookBooking],
      completedAchievements: [],
    })

    expect(categories).toEqual([
      expect.objectContaining({
        name: CombinedAchievementCategory.FIRST_BOOKINGS,
        achievements: [
          // Make sure you expected achievements are sorted alphabetically
          expect.objectContaining({
            name: CombinedAchievementName.FIRST_ART_LESSON_BOOKING,
            title: 'Succès non débloqué',
          }),
          expect.objectContaining({
            name: CombinedAchievementName.FIRST_BOOK_BOOKING,
            title: 'Succès non débloqué',
          }),
        ],
      }),
    ])
  })

  it('achievement completed name is the achievement name', () => {
    const { categories } = testGetAchievements({
      achievements: [firstArtLessonBooking, firstBookBooking],
      completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
    })

    expect(categories).toEqual([
      expect.objectContaining({
        name: CombinedAchievementCategory.FIRST_BOOKINGS,
        achievements: [
          // Make sure you expected achievements are sorted alphabetically
          expect.objectContaining({
            name: CombinedAchievementName.FIRST_ART_LESSON_BOOKING,
            title: firstArtLessonBooking.title,
          }),
          expect.objectContaining({
            name: CombinedAchievementName.FIRST_BOOK_BOOKING,
            title: firstBookBooking.title,
          }),
        ],
      }),
    ])
  })

  it('achivements are sorted by name', () => {
    const { categories } = testGetAchievements({
      achievements: [firstArtLessonBooking, firstBookBooking],
      completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
    })

    expect(categories).toEqual([
      expect.objectContaining({
        name: CombinedAchievementCategory.FIRST_BOOKINGS,
        achievements: [
          // Make sure you expected achievements are sorted alphabetically
          expect.objectContaining({
            name: CombinedAchievementName.FIRST_ART_LESSON_BOOKING,
          }),
          expect.objectContaining({
            name: CombinedAchievementName.FIRST_BOOK_BOOKING,
          }),
        ],
      }),
    ])
  })

  it('achievement completed is sorted before achievement not completed', () => {
    const { categories } = testGetAchievements({
      achievements: [firstBookBooking, firstArtLessonBooking],
      completedAchievements: [userCompletedArtLessonBooking],
    })

    expect(categories).toEqual([
      expect.objectContaining({
        name: CombinedAchievementCategory.FIRST_BOOKINGS,
        achievements: [
          // Make sure you expected achievements are sorted alphabetically
          expect.objectContaining({
            name: CombinedAchievementName.FIRST_ART_LESSON_BOOKING,
          }),
          expect.objectContaining({
            name: CombinedAchievementName.FIRST_BOOK_BOOKING,
          }),
        ],
      }),
    ])
  })

  describe('Category Achievements completion', () => {
    describe('Remaining achievements to complete', () => {
      it('should return "0 succès restant" when all achievements of category are completed', () => {
        const { categories } = testGetAchievements({
          achievements: [firstArtLessonBooking, firstBookBooking],
          completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
        })

        expect(categories).toEqual([
          expect.objectContaining({
            name: CombinedAchievementCategory.FIRST_BOOKINGS,
            remainingAchievementsText: '0 succès restant',
          }),
        ])
      })

      it('should return "1 succès restants" when 1 achievement are not completed', () => {
        const { categories } = testGetAchievements({
          achievements: [firstArtLessonBooking, firstBookBooking],
          completedAchievements: [userCompletedArtLessonBooking],
        })

        expect(categories).toEqual([
          expect.objectContaining({
            name: CombinedAchievementCategory.FIRST_BOOKINGS,
            remainingAchievementsText: '1 succès restant',
          }),
        ])
      })

      it('should return "2 succès restants" when 2 achievement are not completed', () => {
        const { categories } = testGetAchievements({
          achievements: [firstArtLessonBooking, firstBookBooking],
        })

        expect(categories).toEqual([
          expect.objectContaining({
            name: CombinedAchievementCategory.FIRST_BOOKINGS,
            remainingAchievementsText: '2 succès restants',
          }),
        ])
      })
    })

    describe('Achievements progression', () => {
      it('should be 1 when all achievements are completed', () => {
        const { categories } = testGetAchievements({
          achievements: [firstArtLessonBooking],
          completedAchievements: [userCompletedArtLessonBooking],
        })

        expect(categories).toEqual([
          expect.objectContaining({
            name: CombinedAchievementCategory.FIRST_BOOKINGS,
            progress: 1,
          }),
        ])
      })

      it('should be 0 when no achievements are completed', () => {
        const { categories } = testGetAchievements({
          achievements: [firstArtLessonBooking],
        })

        expect(categories).toEqual([
          expect.objectContaining({
            name: CombinedAchievementCategory.FIRST_BOOKINGS,
            progress: 0,
          }),
        ])
      })

      it('should be 0.5 when 1 achievement of 2 are completed', () => {
        const { categories } = testGetAchievements({
          achievements: [firstArtLessonBooking, firstBookBooking],
          completedAchievements: [userCompletedArtLessonBooking],
        })

        expect(categories).toEqual([
          expect.objectContaining({
            name: CombinedAchievementCategory.FIRST_BOOKINGS,
            progress: 0.5,
          }),
        ])
      })

      it('should be 0.75 when 3 achievement of 4 are completed', () => {
        const { categories } = testGetAchievements({
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
            name: CombinedAchievementCategory.FIRST_BOOKINGS,
            progress: 0.75,
          }),
        ])
      })

      describe('text', () => {
        it('should return 0/2 when no achievements are completed', () => {
          const { categories } = testGetAchievements({
            achievements: [firstArtLessonBooking, firstBookBooking],
          })

          expect(categories).toEqual([
            expect.objectContaining({
              name: CombinedAchievementCategory.FIRST_BOOKINGS,
              progressText: '0/2',
            }),
          ])
        })

        it('should return 2/2 when all achievements are completed', () => {
          const { categories } = testGetAchievements({
            achievements: [firstArtLessonBooking, firstBookBooking],
            completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
          })

          expect(categories).toEqual([
            expect.objectContaining({
              name: CombinedAchievementCategory.FIRST_BOOKINGS,
              progressText: '2/2',
            }),
          ])
        })

        it('should return 1/2 when 1 achievement of 2 are completed', () => {
          const { categories } = testGetAchievements({
            achievements: [firstArtLessonBooking, firstBookBooking],
            completedAchievements: [userCompletedArtLessonBooking],
          })

          expect(categories).toEqual([
            expect.objectContaining({
              name: CombinedAchievementCategory.FIRST_BOOKINGS,
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
        const { track } = testGetAchievements()

        track(from)

        expect(analytics.logDisplayAchievements).toHaveBeenCalledWith(
          expect.objectContaining({ from })
        )
      })
    })
  })

  describe('Number unlocked', () => {
    it('send 0 when no achievements are completed', () => {
      const { track } = testGetAchievements()

      track('profile')

      expect(analytics.logDisplayAchievements).toHaveBeenCalledWith(
        expect.objectContaining({ numberUnlocked: 0 })
      )
    })

    it('send 2 when 2 achievement are completed', () => {
      const { track } = testGetAchievements({
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
