import { analytics } from 'libs/analytics/provider'
import { renderHook, act } from 'tests/utils'

import { useOfferHeaderTracking } from '../useOfferHeaderTracking'

jest.mock('libs/firebase/analytics/analytics')

describe('useOfferHeaderTracking', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return a trackShare function', () => {
    const { result } = renderHook(() => useOfferHeaderTracking({ offerId: 123 }))

    expect(result.current.trackShare).toBeInstanceOf(Function)
  })

  it('should call analytics.logShare with correct parameters', () => {
    const { result } = renderHook(() => useOfferHeaderTracking({ offerId: 456 }))

    act(() => {
      result.current.trackShare()
    })

    expect(analytics.logShare).toHaveBeenCalledWith({
      type: 'Offer',
      from: 'offer',
      offerId: 456,
    })
  })

  it('should call analytics.logShare only once per invocation', () => {
    const { result } = renderHook(() => useOfferHeaderTracking({ offerId: 789 }))

    act(() => {
      result.current.trackShare()
    })

    expect(analytics.logShare).toHaveBeenCalledTimes(1)
  })

  it('should update offerId when prop changes', () => {
    const { result, rerender } = renderHook(
      ({ offerId }: { offerId: number }) => useOfferHeaderTracking({ offerId }),
      { initialProps: { offerId: 100 } }
    )

    act(() => {
      result.current.trackShare()
    })

    expect(analytics.logShare).toHaveBeenCalledWith(expect.objectContaining({ offerId: 100 }))

    rerender({ offerId: 200 })

    act(() => {
      result.current.trackShare()
    })

    expect(analytics.logShare).toHaveBeenLastCalledWith(expect.objectContaining({ offerId: 200 }))
  })
})
