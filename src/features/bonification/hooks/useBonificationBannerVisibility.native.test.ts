import { act, renderHook } from 'tests/utils'

import { useBonificationBannerVisibility } from './useBonificationBannerVisibility'

describe('useBonificationBannerVisibility', () => {
  it('should start with hasClosedBonificationBanner as false', () => {
    const { result } = renderHook(() => useBonificationBannerVisibility())

    expect(result.current.hasClosedBonificationBanner).toBe(false)
  })

  it('should return true after onCloseBanner has been called', async () => {
    const { result } = renderHook(() => useBonificationBannerVisibility())

    await act(() => {
      result.current.onCloseBanner()
    })

    expect(result.current.hasClosedBonificationBanner).toBe(true)
  })

  it('should return false after calling the reset function', async () => {
    const { result } = renderHook(() => useBonificationBannerVisibility())

    await act(() => {
      result.current.resetBannerVisibility()
    })

    expect(result.current.hasClosedBonificationBanner).toBe(false)
  })
})
