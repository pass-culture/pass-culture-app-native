import { SubcategoryIdEnumv2 } from 'api/gen'
import { renderHook, act, bottomScrollEvent, middleScrollEvent } from 'tests/utils'

import { useOfferContentTracking } from './useOfferContentTracking'

const mockTrackBatchEvent = jest.fn()
const mockTrackEventHasSeenOfferOnce = jest.fn()

jest.mock('features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking', () => ({
  useOfferBatchTracking: () => ({
    shouldTriggerBatchSurveyEvent: false,
    trackBatchEvent: mockTrackBatchEvent,
    trackEventHasSeenOfferOnce: mockTrackEventHasSeenOfferOnce,
  }),
}))

jest.mock('libs/analytics/provider', () => ({
  analytics: {
    logConsultWholeOffer: jest.fn(),
  },
}))

jest.mock('libs/hooks', () => ({
  useFunctionOnce: (fn: () => void) => fn,
}))

const defaultParams = {
  offerId: 116656,
  subcategoryId: SubcategoryIdEnumv2.CINE_PLEIN_AIR,
}

describe('useOfferContentTracking', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return scrollListener as a function', () => {
    const { result } = renderHook(() => useOfferContentTracking(defaultParams))

    expect(result.current.scrollListener).toBeInstanceOf(Function)
  })

  it('should return trackEventHasSeenOfferOnce', () => {
    const { result } = renderHook(() => useOfferContentTracking(defaultParams))

    expect(result.current.trackEventHasSeenOfferOnce).toBe(mockTrackEventHasSeenOfferOnce)
  })

  it('should not call logConsultWholeOffer when scroll is not at bottom', () => {
    const { analytics } = jest.requireMock('libs/analytics/provider')
    const { result } = renderHook(() => useOfferContentTracking(defaultParams))

    act(() => {
      result.current.scrollListener(
        middleScrollEvent as Parameters<typeof result.current.scrollListener>[0]
      )
    })

    expect(analytics.logConsultWholeOffer).not.toHaveBeenCalled()
  })

  it('should call logConsultWholeOffer when scroll reaches the bottom', () => {
    const { analytics } = jest.requireMock('libs/analytics/provider')
    const { result } = renderHook(() => useOfferContentTracking(defaultParams))

    act(() => {
      result.current.scrollListener(
        bottomScrollEvent as Parameters<typeof result.current.scrollListener>[0]
      )
    })

    expect(analytics.logConsultWholeOffer).toHaveBeenCalledWith(defaultParams.offerId)
  })
})
