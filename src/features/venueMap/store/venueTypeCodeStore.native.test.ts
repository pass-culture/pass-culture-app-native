import { VenueTypeCodeKey } from 'api/gen'
import { useVenueTypeCode, venueTypeCodeActions } from 'features/venueMap/store/venueTypeCodeStore'
import { act, renderHook } from 'tests/utils'

describe('venueTypeCodeStore', () => {
  it('should setTypeCode be null on init', async () => {
    const { result: venueTypeCode } = renderHook(useVenueTypeCode)

    expect(venueTypeCode.current).toEqual(null)
  })

  it('should handle setVenueTypeCode', async () => {
    const { result: venueTypeCode } = renderHook(useVenueTypeCode)

    await act(() => {
      venueTypeCodeActions.setVenueTypeCode(VenueTypeCodeKey.MOVIE)
    })

    expect(venueTypeCode.current).toEqual(VenueTypeCodeKey.MOVIE)
  })
})
