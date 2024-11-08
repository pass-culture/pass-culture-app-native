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
import { useAchievements } from 'features/profile/pages/Achievements/useAchievements'
import { renderHook } from 'tests/utils'

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
  description: 'Test',
  icon: 'Heart',
  category: CombinedAchievementCategory.TEST,
}

describe('useAchievements', () => {
  it('should return empty array when there are no achievements', () => {
    const { result } = renderHook(() =>
      useAchievements({
        achievements: [],
        completedAchievements: [],
      })
    )

    const { badges } = result.current

    expect(badges).toEqual([])
  })

  it('should return achievements grouped by category', () => {
    const { result } = renderHook(() =>
      useAchievements({
        achievements: [firstArtLessonBooking, testAchievement as unknown as Achievement],
        completedAchievements: [],
      })
    )
    const { badges } = result.current

    expect(badges).toEqual([
      expect.objectContaining({
        category: CombinedAchievementCategory.FIRST_BOOKINGS,
        achievements: [
          expect.objectContaining({
            description: firstArtLessonBooking.description,
            icon: firstArtLessonBooking.icon,
            id: CombinedAchievementId.FIRST_ART_LESSON_BOOKING,
            isCompleted: false,
            name: firstArtLessonBooking.name,
          }),
        ],
      }),
      expect.objectContaining({
        category: CombinedAchievementCategory.TEST,
        achievements: [
          expect.objectContaining({
            description: 'Test',
            icon: 'Heart',
            id: 'TEST',
            isCompleted: false,
            name: 'Test',
          }),
        ],
      }),
    ])
  })

  it('achievement is NOT completed when user has not already completed it', () => {
    const { result } = renderHook(() =>
      useAchievements({
        achievements: [firstArtLessonBooking, firstBookBooking],
        completedAchievements: [],
      })
    )
    const { badges } = result.current

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
    const { result } = renderHook(() =>
      useAchievements({
        achievements: [firstArtLessonBooking, firstBookBooking],
        completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
      })
    )
    const { badges } = result.current

    expect(badges).toEqual([
      expect.objectContaining({
        category: CombinedAchievementCategory.FIRST_BOOKINGS,
        achievements: [
          expect.objectContaining({
            id: CombinedAchievementId.FIRST_ART_LESSON_BOOKING,
            isCompleted: true,
          }),
          expect.objectContaining({
            id: CombinedAchievementId.FIRST_BOOK_BOOKING,
            isCompleted: true,
          }),
        ],
      }),
    ])
  })

  describe('Category Achievements completion', () => {
    describe('Remaining achievements to complete', () => {
      it('should return 2 when there are 2 achievements and no one is completed', () => {
        const { result } = renderHook(() =>
          useAchievements({
            achievements: [firstArtLessonBooking, firstBookBooking],
            completedAchievements: [],
          })
        )
        const { badges } = result.current

        expect(badges).toEqual([
          expect.objectContaining({
            category: CombinedAchievementCategory.FIRST_BOOKINGS,
            remainingAchievements: 2,
          }),
        ])
      })

      it('should return 1 when only 1 achievement is remaining', () => {
        const { result } = renderHook(() =>
          useAchievements({
            achievements: [firstArtLessonBooking, firstBookBooking],
            completedAchievements: [userCompletedArtLessonBooking],
          })
        )
        const { badges } = result.current

        expect(badges).toEqual([
          expect.objectContaining({
            category: CombinedAchievementCategory.FIRST_BOOKINGS,
            remainingAchievements: 1,
          }),
        ])
      })

      it('should return 0 when all achievement is completed', () => {
        const { result } = renderHook(() =>
          useAchievements({
            achievements: [firstArtLessonBooking, firstBookBooking],
            completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
          })
        )
        const { badges } = result.current

        expect(badges).toEqual([
          expect.objectContaining({
            category: CombinedAchievementCategory.FIRST_BOOKINGS,
            remainingAchievements: 0,
          }),
        ])
      })
    })

    describe('Achievements progression', () => {
      it('should be 1 when all achievements are completed', () => {
        const { result } = renderHook(() =>
          useAchievements({
            achievements: [firstArtLessonBooking],
            completedAchievements: [userCompletedArtLessonBooking],
          })
        )
        const { badges } = result.current

        expect(badges).toEqual([
          expect.objectContaining({
            category: CombinedAchievementCategory.FIRST_BOOKINGS,
            progress: 1,
          }),
        ])
      })

      it('should be 0 when no achievements are completed', () => {
        const { result } = renderHook(() =>
          useAchievements({
            achievements: [firstArtLessonBooking],
            completedAchievements: [],
          })
        )
        const { badges } = result.current

        expect(badges).toEqual([
          expect.objectContaining({
            category: CombinedAchievementCategory.FIRST_BOOKINGS,
            progress: 0,
          }),
        ])
      })

      it('should be 0.5 when 1 achievement of 2 are completed', () => {
        const { result } = renderHook(() =>
          useAchievements({
            achievements: [firstArtLessonBooking, firstBookBooking],
            completedAchievements: [userCompletedArtLessonBooking],
          })
        )
        const { badges } = result.current

        expect(badges).toEqual([
          expect.objectContaining({
            category: CombinedAchievementCategory.FIRST_BOOKINGS,
            progress: 0.5,
          }),
        ])
      })

      it('should be 0.75 when 3 achievement of 4 are completed', () => {
        const { result } = renderHook(() =>
          useAchievements({
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
        )
        const { badges } = result.current

        expect(badges).toEqual([
          expect.objectContaining({
            category: CombinedAchievementCategory.FIRST_BOOKINGS,
            progress: 0.75,
          }),
        ])
      })

      describe('text', () => {
        it('should return 0% when no achievements are completed', () => {
          const { result } = renderHook(() =>
            useAchievements({
              achievements: [firstArtLessonBooking, firstBookBooking],
              completedAchievements: [],
            })
          )
          const { badges } = result.current

          expect(badges).toEqual([
            expect.objectContaining({
              category: CombinedAchievementCategory.FIRST_BOOKINGS,
              progressText: '0%',
            }),
          ])
        })

        it('should return 100% when all achievements are completed', () => {
          const { result } = renderHook(() =>
            useAchievements({
              achievements: [firstArtLessonBooking, firstBookBooking],
              completedAchievements: [userCompletedArtLessonBooking, userCompletedBookBooking],
            })
          )
          const { badges } = result.current

          expect(badges).toEqual([
            expect.objectContaining({
              category: CombinedAchievementCategory.FIRST_BOOKINGS,
              progressText: '100%',
            }),
          ])
        })

        it('should return 50% when 1 achievement of 2 are completed', () => {
          const { result } = renderHook(() =>
            useAchievements({
              achievements: [firstArtLessonBooking, firstBookBooking],
              completedAchievements: [userCompletedArtLessonBooking],
            })
          )
          const { badges } = result.current

          expect(badges).toEqual([
            expect.objectContaining({
              category: CombinedAchievementCategory.FIRST_BOOKINGS,
              progressText: '50%',
            }),
          ])
        })

        it('should return 33% when 1 achievement of 3 are completed', () => {
          const { result } = renderHook(() =>
            useAchievements({
              achievements: [firstArtLessonBooking, firstBookBooking, firstMovieBooking],
              completedAchievements: [userCompletedArtLessonBooking],
            })
          )
          const { badges } = result.current

          expect(badges).toEqual([
            expect.objectContaining({
              category: CombinedAchievementCategory.FIRST_BOOKINGS,
              progressText: '33%',
            }),
          ])
        })
      })
    })
  })
})
