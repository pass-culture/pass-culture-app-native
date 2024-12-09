import { AchievementEnum } from 'api/gen'
import {
  firstBookBooking,
  firstNewsBooking,
} from 'features/profile/pages/Achievements/AchievementData'
import { analytics } from 'libs/analytics/__mocks__/provider'

import { useAchievementDetails } from './useAchievementDetails'

describe('useAchievementDetails', () => {
  describe('Achievement is completed', () => {
    it('should return the achievement details', () => {
      const details = useAchievementDetails(firstBookBooking.name)

      expect(details).toEqual(
        expect.objectContaining({
          title: firstBookBooking.title,
          completed: true,
          completedAt: '02/12/2024',
          illustration: firstBookBooking.illustrationUnlockedDetailed,
          description: firstBookBooking.descriptionUnlocked,
        })
      )
    })
  })

  describe('Achievement is NOT completed', () => {
    it('should return the achievement details', () => {
      const details = useAchievementDetails(firstNewsBooking.name)

      expect(details).toEqual(
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
    const details = useAchievementDetails('unknown' as unknown as AchievementEnum)

    expect(details).toBeUndefined()
  })

  describe('tracking', () => {
    it('should track the achievement details', () => {
      const details = useAchievementDetails(firstBookBooking.name)
      details?.track()

      expect(analytics.logConsultAchievementModal).toHaveBeenCalledWith({
        achievementName: firstBookBooking.name,
        state: 'unlocked',
      })
    })

    it('tracking state is "locked" if the achievement is not completed', () => {
      const details = useAchievementDetails(firstNewsBooking.name)
      details?.track()

      expect(analytics.logConsultAchievementModal).toHaveBeenCalledWith({
        achievementName: firstNewsBooking.name,
        state: 'locked',
      })
    })
  })
})
