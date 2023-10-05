import { Platform, Share } from 'react-native'

import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { WEBAPP_V2_URL } from 'libs/environment'
import { act, renderHook } from 'tests/utils'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

import { getShareOffer, useShareOffer } from './useShareOffer'

jest.mock('react-query')
jest.mock('features/offer/api/useOffer')

const mockShare = jest
  .spyOn(Share, 'share')
  .mockResolvedValue({ action: Share.sharedAction, activityType: 'copy' })

const shareTitle = 'Je t’invite à découvrir une super offre sur le pass Culture\u00a0!'
const shareOptions = {
  subject: shareTitle,
  dialogTitle: shareTitle,
}

const shareMessage =
  'Retrouve "Je ne sais pas ce que je dis" chez "Cinéma de la fin" sur le pass Culture'

const shareContentIos = {
  message: shareMessage,
  messageWithoutLink: shareMessage,
  url: `${WEBAPP_V2_URL}/offre/146112?utm_gen=product&utm_campaign=share_offer&utm_medium=utm_medium`,
  title: shareTitle,
}

const shareContentAndroid = {
  message:
    shareMessage +
    DOUBLE_LINE_BREAK +
    `${WEBAPP_V2_URL}/offre/146112?utm_gen=product&utm_campaign=share_offer&utm_medium=utm_medium`,
  messageWithoutLink: shareMessage,
  url: `${WEBAPP_V2_URL}/offre/146112?utm_gen=product&utm_campaign=share_offer&utm_medium=utm_medium`,
  title: shareTitle,
}

describe('useShareOffer', () => {
  describe('should display share modal with data from offer', () => {
    const offer = mockOffer

    it('for ios', async () => {
      Platform.OS = 'ios'
      const { result } = renderHook(() => useShareOffer(offer.id, 'utm_medium'))

      const { share } = result.current
      await act(async () => share())

      expect(mockShare).toHaveBeenNthCalledWith(1, shareContentIos, shareOptions)
    })

    it('for android', async () => {
      Platform.OS = 'android'
      const { result } = renderHook(() => useShareOffer(offer.id, 'utm_medium'))

      const { share } = result.current
      await act(async () => share())

      expect(mockShare).toHaveBeenNthCalledWith(1, shareContentAndroid, shareOptions)
    })
  })
})

describe('getShareOffer', () => {
  describe('should do nothing when data are incomplete', () => {
    it('should do nothing when there is no offer id', async () => {
      const { share } = getShareOffer({
        offerId: undefined,
        offerName: 'Donjons & Dragons : L’Honneur des voleurs - VO',
        venueName: 'L’Orange Bleue*',
        utmMedium: 'utm_medium',
      })

      await act(async () => share())

      expect(mockShare).not.toHaveBeenCalled()
    })

    it('should do nothing when there is no offer name', async () => {
      const { share } = getShareOffer({
        offerId: 146112,
        offerName: undefined,
        venueName: 'L’Orange Bleue*',
        utmMedium: 'utm_medium',
      })

      await act(async () => share())

      expect(mockShare).not.toHaveBeenCalled()
    })

    it('should do nothing when there is no venue name', async () => {
      const { shareContent } = getShareOffer({
        offerId: 146112,
        offerName: 'Donjons & Dragons : L’Honneur des voleurs - VO',
        venueName: undefined,
        utmMedium: 'utm_medium',
      })

      expect(shareContent).toBeUndefined()
    })
  })

  describe('should display share modal with data from offer', () => {
    it('for ios', async () => {
      Platform.OS = 'ios'
      const { share } = getShareOffer({
        offerId: 146112,
        offerName: 'Donjons & Dragons : L’Honneur des voleurs - VO',
        venueName: 'L’Orange Bleue*',
        utmMedium: 'utm_medium',
      })

      await act(async () => share())

      const shareTitle = 'Je t’invite à découvrir une super offre sur le pass Culture\u00a0!'
      expect(mockShare).toHaveBeenNthCalledWith(
        1,
        {
          message:
            'Retrouve "Donjons & Dragons : L’Honneur des voleurs - VO" chez "L’Orange Bleue*" sur le pass Culture',
          messageWithoutLink:
            'Retrouve "Donjons & Dragons : L’Honneur des voleurs - VO" chez "L’Orange Bleue*" sur le pass Culture',
          url: `${WEBAPP_V2_URL}/offre/146112?utm_gen=product&utm_campaign=share_offer&utm_medium=utm_medium`,
          title: shareTitle,
        },
        {
          subject: shareTitle,
          dialogTitle: shareTitle,
        }
      )
    })

    it('for android', async () => {
      Platform.OS = 'android'
      const { share } = getShareOffer({
        offerId: 146112,
        offerName: 'Donjons & Dragons : L’Honneur des voleurs - VO',
        venueName: 'L’Orange Bleue*',
        utmMedium: 'utm_medium',
      })

      await act(async () => share())

      expect(mockShare).toHaveBeenNthCalledWith(
        1,
        {
          message: `Retrouve "Donjons & Dragons : L’Honneur des voleurs - VO" chez "L’Orange Bleue*" sur le pass Culture\n\n${WEBAPP_V2_URL}/offre/146112?utm_gen=product&utm_campaign=share_offer&utm_medium=utm_medium`,
          messageWithoutLink:
            'Retrouve "Donjons & Dragons : L’Honneur des voleurs - VO" chez "L’Orange Bleue*" sur le pass Culture',
          url: `${WEBAPP_V2_URL}/offre/146112?utm_gen=product&utm_campaign=share_offer&utm_medium=utm_medium`,
          title: shareTitle,
        },
        {
          subject: shareTitle,
          dialogTitle: shareTitle,
        }
      )
    })
  })
})
