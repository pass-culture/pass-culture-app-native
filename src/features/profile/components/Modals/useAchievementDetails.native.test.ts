import {
  AchievementId,
  firstBookBooking,
  firstNewsBooking,
} from 'features/profile/pages/Achievements/AchievementData'
import { analytics } from 'libs/analytics/__mocks__/provider'

import { useAchievementDetails } from './useAchievementDetails'

describe('useAchievementDetails', () => {
  describe('Achievement is completed', () => {
    it('should return the achievement details', () => {
      const details = useAchievementDetails(firstBookBooking.id)

      expect(details).toEqual(
        expect.objectContaining({
          name: firstBookBooking.name,
          completed: true,
          completedAt: '02/12/2024',
          illustration: firstBookBooking.illustrationUnlocked,
          description: firstBookBooking.descriptionUnlocked,
        })
      )
    })
  })

  describe('Achievement is NOT completed', () => {
    it('should return the achievement details', () => {
      const details = useAchievementDetails(firstNewsBooking.id)

      expect(details).toEqual(
        expect.objectContaining({
          name: firstNewsBooking.name,
          completed: false,
          completedAt: undefined,
          illustration: firstNewsBooking.illustrationLocked,
          description: firstNewsBooking.descriptionLocked,
        })
      )
    })
  })

  it('should return undefined if the achievement is not found', () => {
    const details = useAchievementDetails('unknown' as unknown as AchievementId)

    expect(details).toBeUndefined()
  })

  describe('tracking', () => {
    it('should track the achievement details', () => {
      const details = useAchievementDetails(firstBookBooking.id)
      details?.track()

      expect(analytics.logConsultAchievementModal).toHaveBeenCalledWith({
        achievementName: firstBookBooking.id,
        state: 'unlocked',
      })
    })

    it('tracking state is "locked" if the achievement is not completed', () => {
      const details = useAchievementDetails(firstNewsBooking.id)
      details?.track()

      expect(analytics.logConsultAchievementModal).toHaveBeenCalledWith({
        achievementName: firstNewsBooking.id,
        state: 'locked',
      })
    })
  })
})
