import { AchievementEnum } from 'api/gen'
import {
  firstBookBooking,
  firstNewsBooking,
  mockCompletedAchievements,
} from 'features/profile/pages/Achievements/AchievementData'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/__mocks__/provider'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { renderHook } from 'tests/utils'

import { useAchievementDetails } from './useAchievementDetails'

jest.mock('features/auth/context/AuthContext')

describe('useAchievementDetails', () => {
  describe('Achievement is completed', () => {
    it('should return the achievement result.current', () => {
      const { result } = renderHook(() => useAchievementDetails(firstBookBooking.name))

      expect(result.current).toEqual(
        expect.objectContaining({
          title: firstBookBooking.title,
          completed: false,
          completedAt: undefined,
          illustration: firstBookBooking.illustrationLockedDetailed,
          description: firstBookBooking.descriptionLocked,
        })
      )
    })
  })

  describe('Achievement is NOT completed', () => {
    it('should return the achievement result.current', () => {
      const { result } = renderHook(() => useAchievementDetails(firstNewsBooking.name))

      expect(result.current).toEqual(
        expect.objectContaining({
          title: firstNewsBooking.title,
          completed: false,
          completedAt: undefined,
          illustration: firstNewsBooking.illustrationLockedDetailed,
          description: firstNewsBooking.descriptionLocked,
        })
      )
    })
  })

  it('should return undefined if the achievement is not found', () => {
    const { result } = renderHook(() =>
      useAchievementDetails('unknown' as unknown as AchievementEnum)
    )

    expect(result.current).toBeUndefined()
  })

  describe('tracking', () => {
    beforeEach(() => {
      mockAuthContextWithUser({
        ...beneficiaryUser,
        achievements: mockCompletedAchievements,
      })
    })

    it('should track the achievement result.current', () => {
      const { result } = renderHook(() => useAchievementDetails(firstBookBooking.name))
      result.current?.track()

      expect(analytics.logConsultAchievementModal).toHaveBeenCalledWith({
        achievementName: firstBookBooking.name,
        state: 'unlocked',
      })
    })

    it('tracking state is "locked" if the achievement is not completed', () => {
      const { result } = renderHook(() => useAchievementDetails(firstNewsBooking.name))
      result.current?.track()

      expect(analytics.logConsultAchievementModal).toHaveBeenCalledWith({
        achievementName: firstNewsBooking.name,
        state: 'locked',
      })
    })
  })
})
