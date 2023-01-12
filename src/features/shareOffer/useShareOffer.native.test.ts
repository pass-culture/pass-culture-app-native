import { Platform, Share } from 'react-native'

import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { WEBAPP_V2_URL } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { act, renderHook } from 'tests/utils'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

import { useShareOffer } from './useShareOffer'

const mockShare = jest
  .spyOn(Share, 'share')
  .mockResolvedValue({ action: Share.sharedAction, activityType: 'copy' })

const shareTitle = "Je t'invite à découvrir une super offre sur le pass Culture\u00a0!"
const shareOptions = {
  subject: shareTitle,
  dialogTitle: shareTitle,
}

describe('useShareOffer', () => {
  it('should not share when no offer provided', () => {
    const offer = undefined
    const { result } = renderHook(() => useShareOffer({ offer }))

    const { share } = result.current
    act(() => share())

    expect(mockShare).not.toHaveBeenCalled()
  })

  it('should log event in analytics when sharing', () => {
    const offer = mockOffer
    const { result } = renderHook(() => useShareOffer({ offer }))

    const { share } = result.current
    act(() => share())

    expect(analytics.logShareOffer).toHaveBeenNthCalledWith(1, mockOffer.id)
  })

  it('should log event in analytics once when when multiple sharing', () => {
    const offer = mockOffer
    const { result } = renderHook(() => useShareOffer({ offer }))

    const { share } = result.current
    act(() => share())
    act(() => share())

    expect(analytics.logShareOffer).toHaveBeenNthCalledWith(1, mockOffer.id)
  })

  describe('should display share modal with data from offer', () => {
    const offer = mockOffer

    it('for ios', () => {
      Platform.OS = 'ios'
      const { result } = renderHook(() => useShareOffer({ offer }))

      const { share } = result.current
      act(() => share())

      const shareContent = {
        message:
          'Retrouve "Je ne sais pas ce que je dis" chez "Cinéma de la fin" sur le pass Culture',
        url: `${WEBAPP_V2_URL}/offre/146112`,
        title: shareTitle,
      }
      expect(mockShare).toHaveBeenNthCalledWith(1, shareContent, shareOptions)
    })

    it('for android', () => {
      Platform.OS = 'android'
      const { result } = renderHook(() => useShareOffer({ offer }))

      const { share } = result.current
      act(() => share())

      const shareContent = {
        message:
          'Retrouve "Je ne sais pas ce que je dis" chez "Cinéma de la fin" sur le pass Culture' +
          DOUBLE_LINE_BREAK +
          `${WEBAPP_V2_URL}/offre/146112`,
        url: `${WEBAPP_V2_URL}/offre/146112`,
        title: shareTitle,
      }
      expect(mockShare).toHaveBeenNthCalledWith(1, shareContent, shareOptions)
    })
  })
})
