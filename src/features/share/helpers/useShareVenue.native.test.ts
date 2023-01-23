import { Platform, Share } from 'react-native'

import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { WEBAPP_V2_URL } from 'libs/environment'
import { act, renderHook } from 'tests/utils'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

import { useShareVenue } from './useShareVenue'

jest.mock('react-query')
jest.mock('features/venue/api/useVenue')

const mockShare = jest
  .spyOn(Share, 'share')
  .mockResolvedValue({ action: Share.sharedAction, activityType: 'copy' })

const shareTitle = 'Retrouve "Le Petit Rintintin 1" sur le pass Culture'
const shareOptions = {
  subject: shareTitle,
  dialogTitle: shareTitle,
}

const shareContentIos = {
  message: shareTitle,
  url: `${WEBAPP_V2_URL}/lieu/5543`,
  title: shareTitle,
}

const shareContentAndroid = {
  message: shareTitle + DOUBLE_LINE_BREAK + `${WEBAPP_V2_URL}/lieu/5543`,
  url: `${WEBAPP_V2_URL}/lieu/5543`,
  title: shareTitle,
}

describe('useShareVenue', () => {
  describe('should display share modal with data from venue', () => {
    const venue = venueResponseSnap

    it('for ios', async () => {
      Platform.OS = 'ios'
      const { result } = renderHook(() => useShareVenue(venue.id))

      const { share } = result.current
      await act(async () => share())

      expect(mockShare).toHaveBeenNthCalledWith(1, shareContentIos, shareOptions)
    })

    it('for android', async () => {
      Platform.OS = 'android'
      const { result } = renderHook(() => useShareVenue(venue.id))

      const { share } = result.current
      await act(async () => share())

      expect(mockShare).toHaveBeenNthCalledWith(1, shareContentAndroid, shareOptions)
    })
  })
})
