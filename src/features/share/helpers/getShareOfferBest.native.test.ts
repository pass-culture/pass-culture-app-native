import { Platform, Share } from 'react-native'

import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { WEBAPP_V2_URL } from 'libs/environment'

import { getShareOffer } from './getShareOfferBest'

const mockShare = jest
  .spyOn(Share, 'share')
  .mockResolvedValue({ action: Share.sharedAction, activityType: 'copy' })

const offer = mockOffer

describe('getShareOffer', () => {
  describe('should display share modal with data from offer', () => {
    it('for ios', async () => {
      Platform.OS = 'ios'
      const { share } = getShareOffer({ offer, utmMedium: 'utm_medium' })

      await share()

      expect(mockShare).toHaveBeenCalledWith(
        {
          message:
            'Retrouve "Je ne sais pas ce que je dis" chez "Cinéma de la fin" sur le pass Culture :\n',
          url: `${WEBAPP_V2_URL}/offre/146112?utm_gen=product&utm_campaign=share_offer&utm_medium=utm_medium`,
        },
        { subject: 'Je t’invite à découvrir une super offre sur le pass Culture\u00a0!' }
      )
    })

    it('for android', async () => {
      Platform.OS = 'android'
      const { share } = getShareOffer({ offer, utmMedium: 'utm_medium' })

      await share()

      expect(mockShare).toHaveBeenCalledWith(
        {
          message:
            'Retrouve "Je ne sais pas ce que je dis" chez "Cinéma de la fin" sur le pass Culture :\n' +
            `${WEBAPP_V2_URL}/offre/146112?utm_gen=product&utm_campaign=share_offer&utm_medium=utm_medium`,
          title: 'Je t’invite à découvrir une super offre sur le pass Culture\u00a0!',
        },
        { dialogTitle: 'Je t’invite à découvrir une super offre sur le pass Culture\u00a0!' }
      )
    })
  })
})
