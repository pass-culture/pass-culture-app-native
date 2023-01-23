import { Platform, Share } from 'react-native'

import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { WEBAPP_V2_URL } from 'libs/environment'
import { act, renderHook } from 'tests/utils'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

import { useShareOffer } from './useShareOffer'

jest.mock('react-query')
jest.mock('features/offer/api/useOffer')

const mockShare = jest
  .spyOn(Share, 'share')
  .mockResolvedValue({ action: Share.sharedAction, activityType: 'copy' })

const shareTitle = "Je t'invite à découvrir une super offre sur le pass Culture\u00a0!"
const shareOptions = {
  subject: shareTitle,
  dialogTitle: shareTitle,
}

const shareContentIos = {
  message: 'Retrouve "Je ne sais pas ce que je dis" chez "Cinéma de la fin" sur le pass Culture',
  url: `${WEBAPP_V2_URL}/offre/146112`,
  title: shareTitle,
}

const shareContentAndroid = {
  message:
    'Retrouve "Je ne sais pas ce que je dis" chez "Cinéma de la fin" sur le pass Culture' +
    DOUBLE_LINE_BREAK +
    `${WEBAPP_V2_URL}/offre/146112`,
  url: `${WEBAPP_V2_URL}/offre/146112`,
  title: shareTitle,
}

describe('useShareOffer', () => {
  describe('should display share modal with data from offer', () => {
    const offer = mockOffer

    it('for ios', async () => {
      Platform.OS = 'ios'
      const { result } = renderHook(() => useShareOffer(offer.id))

      const { shareOffer } = result.current
      await act(async () => shareOffer())

      expect(mockShare).toHaveBeenNthCalledWith(1, shareContentIos, shareOptions)
    })

    it('for android', async () => {
      Platform.OS = 'android'
      const { result } = renderHook(() => useShareOffer(offer.id))

      const { shareOffer } = result.current
      await act(async () => shareOffer())

      expect(mockShare).toHaveBeenNthCalledWith(1, shareContentAndroid, shareOptions)
    })
  })
})
