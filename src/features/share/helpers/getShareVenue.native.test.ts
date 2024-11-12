import { Platform, Share } from 'react-native'

import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { WEBAPP_V2_URL } from 'libs/environment'

import { getShareVenue } from './getShareVenue'

const mockShare = jest
  .spyOn(Share, 'share')
  .mockResolvedValue({ action: Share.sharedAction, activityType: 'copy' })

const venue = venueDataTest

jest.mock('libs/firebase/analytics/analytics')

describe('getShareVenue', () => {
  describe('should display share modal with data from offer', () => {
    it('for ios', async () => {
      Platform.OS = 'ios'
      const { share } = getShareVenue({ venue, utmMedium: 'utm_medium' })

      await share()

      expect(mockShare).toHaveBeenCalledWith(
        {
          message: 'Retrouve "Le Petit Rintintin 1" sur le pass Culture :\n',
          url: `${WEBAPP_V2_URL}/lieu/5543?utm_gen=product&utm_campaign=share_venue&utm_medium=utm_medium`,
        },
        { subject: 'Retrouve "Le Petit Rintintin 1" sur le pass Culture' }
      )
    })

    it('for android', async () => {
      Platform.OS = 'android'
      const { share } = getShareVenue({ venue, utmMedium: 'utm_medium' })

      await share()

      expect(mockShare).toHaveBeenCalledWith(
        {
          message:
            'Retrouve "Le Petit Rintintin 1" sur le pass Culture :\n' +
            `${WEBAPP_V2_URL}/lieu/5543?utm_gen=product&utm_campaign=share_venue&utm_medium=utm_medium`,
          title: 'Retrouve "Le Petit Rintintin 1" sur le pass Culture',
        },
        { dialogTitle: 'Retrouve "Le Petit Rintintin 1" sur le pass Culture' }
      )
    })
  })
})
