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
import { renderHook } from 'tests/utils'
import { BicolorTrophy, Trophy } from 'ui/svg/icons/Trophy'

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
  illustrationLocked: Trophy,
  illustrationUnlocked: BicolorTrophy,
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
    const badges = testUseAchievements()

    expect(badges).toEqual([])
  })

  it('should return achievements grouped by category', () => {
    const badges = testUseAchievements({
      achievements: [firstArtLessonBooking, testAchievement as unknown as Achievement],
    })

    expect(badges).toEqual([
      expect.objectContaining({
        category: CombinedAchievementCategory.FIRST_BOOKINGS,
        achievements: [
          expect.objectContaining({
            id: CombinedAchievementId.FIRST_ART_LESSON_BOOKING,
          }),
        ],
      }),
      expect.objectContaining({
        category: CombinedAchievementCategory.TEST,
        achievements: [
          expect.objectContaining({
            id: 'TEST',
          }),
        ],
      }),
    ])
  })

  it('achievement is NOT completed when user has not already completed it', () => {
    const badges = testUseAchievements({
      achievements: [firstArtLessonBooking, firstBookBooking],
    })

    expect(badges).toEqual([
      expect.objectContaining({
        category: CombinedAchievementCategory.FIRST_BOOKINGS,
        achievements: [
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
    const badges = testUseAchievements({
      achievements: [firstArtLessonBooking, firstBookBooking],
      completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
    })

    expect(badges).toEqual([
      expect.objectContaining({
        category: CombinedAchievementCategory.FIRST_BOOKINGS,
        achievements: [
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
    const badges = testUseAchievements({
      achievements: [firstArtLessonBooking, firstBookBooking],
      completedAchievements: [],
    })

    expect(badges).toEqual([
      expect.objectContaining({
        category: CombinedAchievementCategory.FIRST_BOOKINGS,
        achievements: [
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
    const badges = testUseAchievements({
      achievements: [firstArtLessonBooking, firstBookBooking],
      completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
    })

    expect(badges).toEqual([
      expect.objectContaining({
        category: CombinedAchievementCategory.FIRST_BOOKINGS,
        achievements: [
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
    const badges = testUseAchievements({
      achievements: [firstArtLessonBooking, firstBookBooking],
      completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
    })

    expect(badges).toEqual([
      expect.objectContaining({
        category: CombinedAchievementCategory.FIRST_BOOKINGS,
        achievements: [
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
    const badges = testUseAchievements({
      achievements: [firstBookBooking, firstArtLessonBooking],
      completedAchievements: [userCompletedArtLessonBooking],
    })

    expect(badges).toEqual([
      expect.objectContaining({
        category: CombinedAchievementCategory.FIRST_BOOKINGS,
        achievements: [
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
        const badges = testUseAchievements({
          achievements: [firstArtLessonBooking, firstBookBooking],
          completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
        })

        expect(badges).toEqual([
          expect.objectContaining({
            category: CombinedAchievementCategory.FIRST_BOOKINGS,
            remainingAchievementsText: '0 badge restant',
          }),
        ])
      })

      it('should return "1 badge restants" when 1 achievement are not completed', () => {
        const badges = testUseAchievements({
          achievements: [firstArtLessonBooking, firstBookBooking],
          completedAchievements: [userCompletedArtLessonBooking],
        })

        expect(badges).toEqual([
          expect.objectContaining({
            category: CombinedAchievementCategory.FIRST_BOOKINGS,
            remainingAchievementsText: '1 badge restant',
          }),
        ])
      })

      it('should return "2 badges restants" when 2 achievement are not completed', () => {
        const badges = testUseAchievements({
          achievements: [firstArtLessonBooking, firstBookBooking],
        })

        expect(badges).toEqual([
          expect.objectContaining({
            category: CombinedAchievementCategory.FIRST_BOOKINGS,
            remainingAchievementsText: '2 badges restant',
          }),
        ])
      })
    })

    describe('Achievements progression', () => {
      it('should be 1 when all achievements are completed', () => {
        const badges = testUseAchievements({
          achievements: [firstArtLessonBooking],
          completedAchievements: [userCompletedArtLessonBooking],
        })

        expect(badges).toEqual([
          expect.objectContaining({
            category: CombinedAchievementCategory.FIRST_BOOKINGS,
            progress: 1,
          }),
        ])
      })

      it('should be 0 when no achievements are completed', () => {
        const badges = testUseAchievements({
          achievements: [firstArtLessonBooking],
        })

        expect(badges).toEqual([
          expect.objectContaining({
            category: CombinedAchievementCategory.FIRST_BOOKINGS,
            progress: 0,
          }),
        ])
      })

      it('should be 0.5 when 1 achievement of 2 are completed', () => {
        const badges = testUseAchievements({
          achievements: [firstArtLessonBooking, firstBookBooking],
          completedAchievements: [userCompletedArtLessonBooking],
        })

        expect(badges).toEqual([
          expect.objectContaining({
            category: CombinedAchievementCategory.FIRST_BOOKINGS,
            progress: 0.5,
          }),
        ])
      })

      it('should be 0.75 when 3 achievement of 4 are completed', () => {
        const badges = testUseAchievements({
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

        expect(badges).toEqual([
          expect.objectContaining({
            category: CombinedAchievementCategory.FIRST_BOOKINGS,
            progress: 0.75,
          }),
        ])
      })

      describe('text', () => {
        it('should return 0/2 when no achievements are completed', () => {
          const badges = testUseAchievements({
            achievements: [firstArtLessonBooking, firstBookBooking],
          })

          expect(badges).toEqual([
            expect.objectContaining({
              category: CombinedAchievementCategory.FIRST_BOOKINGS,
              progressText: '0/2',
            }),
          ])
        })

        it('should return 2/2 when all achievements are completed', () => {
          const badges = testUseAchievements({
            achievements: [firstArtLessonBooking, firstBookBooking],
            completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
          })

          expect(badges).toEqual([
            expect.objectContaining({
              category: CombinedAchievementCategory.FIRST_BOOKINGS,
              progressText: '2/2',
            }),
          ])
        })

        it('should return 1/2 when 1 achievement of 2 are completed', () => {
          const badges = testUseAchievements({
            achievements: [firstArtLessonBooking, firstBookBooking],
            completedAchievements: [userCompletedArtLessonBooking],
          })

          expect(badges).toEqual([
            expect.objectContaining({
              category: CombinedAchievementCategory.FIRST_BOOKINGS,
              progressText: '1/2',
            }),
          ])
        })
      })
    })
  })
})
