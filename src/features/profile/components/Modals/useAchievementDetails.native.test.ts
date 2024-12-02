import {
  AchievementId,
  firstBookBooking,
  firstNewsBooking,
} from 'features/profile/pages/Achievements/AchievementData'

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
})
