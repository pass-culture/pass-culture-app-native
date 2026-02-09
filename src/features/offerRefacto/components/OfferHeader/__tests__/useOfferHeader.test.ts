import { Animated } from 'react-native'

import * as useGoBack from 'features/navigation/useGoBack'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as getShareOfferModule from 'features/share/helpers/getShareOffer'
import { analytics } from 'libs/analytics/provider'
import { renderHook, act } from 'tests/utils'

import { useOfferHeader } from '../useOfferHeader'

jest.mock('libs/firebase/analytics/analytics')

const mockAnimationState = {
  iconBackgroundColor: new Animated.Value(0) as Animated.AnimatedInterpolation<string | number>,
  iconBorderColor: new Animated.Value(0) as Animated.AnimatedInterpolation<string | number>,
  transition: new Animated.Value(0) as Animated.AnimatedInterpolation<string | number>,
}

jest.mock('../useOfferHeaderAnimation', () => ({
  useOfferHeaderAnimation: jest.fn(() => mockAnimationState),
}))

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

const mockShareContent = { url: 'https://test.com', body: 'Test share' }
const mockExecuteShare = jest.fn()
jest.spyOn(getShareOfferModule, 'getShareOffer').mockReturnValue({
  share: mockExecuteShare,
  shareContent: mockShareContent,
})

jest.mock('features/navigation/SearchStackNavigator/getSearchHookConfig', () => ({
  getSearchHookConfig: jest.fn(() => ['SearchLanding', undefined]),
}))

const headerTransition = new Animated.Value(0) as Animated.AnimatedInterpolation<number>

describe('useOfferHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the offer name as title', () => {
    const { result } = renderHook(() =>
      useOfferHeader({ offer: offerResponseSnap, headerTransition })
    )

    expect(result.current.title).toBe(offerResponseSnap.name)
  })

  it('should return share modal initially hidden', () => {
    const { result } = renderHook(() =>
      useOfferHeader({ offer: offerResponseSnap, headerTransition })
    )

    expect(result.current.shareModal.isVisible).toBe(false)
    expect(result.current.shareModal.content).toEqual(mockShareContent)
    expect(result.current.shareModal.title).toBe('Partager l\u2019offre')
  })

  it('should return animation state', () => {
    const { result } = renderHook(() =>
      useOfferHeader({ offer: offerResponseSnap, headerTransition })
    )

    expect(result.current.animationState).toBe(mockAnimationState)
  })

  it('should log analytics and execute share on share press', () => {
    const { result } = renderHook(() =>
      useOfferHeader({ offer: offerResponseSnap, headerTransition })
    )

    act(() => {
      result.current.onSharePress()
    })

    expect(analytics.logShare).toHaveBeenCalledWith({
      type: 'Offer',
      from: 'offer',
      offerId: offerResponseSnap.id,
    })
    expect(mockExecuteShare).toHaveBeenCalledTimes(1)
  })

  it('should call goBack on back press', () => {
    const { result } = renderHook(() =>
      useOfferHeader({ offer: offerResponseSnap, headerTransition })
    )

    act(() => {
      result.current.onBackPress()
    })

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should show share modal after share press', () => {
    const { result } = renderHook(() =>
      useOfferHeader({ offer: offerResponseSnap, headerTransition })
    )

    expect(result.current.shareModal.isVisible).toBe(false)

    act(() => {
      result.current.onSharePress()
    })

    expect(result.current.shareModal.isVisible).toBe(true)
  })

  it('should hide share modal on dismiss', () => {
    const { result } = renderHook(() =>
      useOfferHeader({ offer: offerResponseSnap, headerTransition })
    )

    act(() => {
      result.current.onSharePress()
    })

    expect(result.current.shareModal.isVisible).toBe(true)

    act(() => {
      result.current.onDismissShareModal()
    })

    expect(result.current.shareModal.isVisible).toBe(false)
  })

  it('should return null shareContent when getShareOffer returns null', () => {
    jest.spyOn(getShareOfferModule, 'getShareOffer').mockReturnValueOnce({
      share: jest.fn(),
      shareContent: null,
    })

    const { result } = renderHook(() =>
      useOfferHeader({ offer: offerResponseSnap, headerTransition })
    )

    expect(result.current.shareModal.content).toBeNull()
  })

  it('should return all expected ViewModel properties', () => {
    const { result } = renderHook(() =>
      useOfferHeader({ offer: offerResponseSnap, headerTransition })
    )

    expect(result.current).toEqual(
      expect.objectContaining({
        title: expect.any(String),
        animationState: expect.any(Object),
        shareModal: expect.objectContaining({
          isVisible: expect.any(Boolean),
          title: expect.any(String),
        }),
        onBackPress: expect.any(Function),
        onSharePress: expect.any(Function),
        onDismissShareModal: expect.any(Function),
      })
    )
  })
})
