import { Platform, Share } from 'react-native'

import { mockArtist } from 'features/artist/fixtures/mockArtist'
import { getShareArtist } from 'features/share/helpers/getShareArtist'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'

const mockShare = jest
  .spyOn(Share, 'share')
  .mockResolvedValue({ action: Share.sharedAction, activityType: 'copy' })

jest.mock('libs/firebase/analytics/analytics')

describe('getShareArtist', () => {
  describe('should display share modal with data from artist', () => {
    it('for ios', async () => {
      Platform.OS = 'ios'
      const { share } = getShareArtist({ artist: mockArtist, utmMedium: 'utm_medium' })

      await share()

      expect(mockShare).toHaveBeenCalledWith(
        {
          message: 'Retrouve "Avril Lavigne" sur le pass Culture :\n',
          url: `${WEBAPP_V2_URL}/artiste/cb22d035-f081-4ccb-99d8-8f5725a8ac9c?utm_gen=product&utm_campaign=share_artist&utm_medium=utm_medium`,
        },
        { subject: 'Retrouve "Avril Lavigne" sur le pass Culture' }
      )
    })

    it('for android', async () => {
      Platform.OS = 'android'
      const { share } = getShareArtist({ artist: mockArtist, utmMedium: 'utm_medium' })

      await share()

      expect(mockShare).toHaveBeenCalledWith(
        {
          message:
            'Retrouve "Avril Lavigne" sur le pass Culture :\n' +
            `${WEBAPP_V2_URL}/artiste/cb22d035-f081-4ccb-99d8-8f5725a8ac9c?utm_gen=product&utm_campaign=share_artist&utm_medium=utm_medium`,
          title: 'Retrouve "Avril Lavigne" sur le pass Culture',
        },
        { dialogTitle: 'Retrouve "Avril Lavigne" sur le pass Culture' }
      )
    })
  })
})
