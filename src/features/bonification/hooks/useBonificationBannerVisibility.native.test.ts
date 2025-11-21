import { storage } from 'libs/storage'
import { renderHook } from 'tests/utils'

import { useBonificationBannerVisibility } from './useBonificationBannerVisibility'

describe('useBonificationBannerVisibility', () => {
  beforeEach(() => {
    void storage.clear('has_closed_bonification_banner')
  })

  it('should start with hasClosedBonificationBanner as null', async () => {
    renderHook(() => useBonificationBannerVisibility())

    const storageValue = await storage.readString('has_closed_bonification_banner')

    expect(storageValue).toBe(null)
  })

  it('should return true if onCloseBanner has been called', async () => {
    const { result } = renderHook(() => useBonificationBannerVisibility())

    result.current.onCloseBanner()

    const storageValue = await storage.readString('has_closed_bonification_banner')

    expect(storageValue).toBe('true')
  })
})
