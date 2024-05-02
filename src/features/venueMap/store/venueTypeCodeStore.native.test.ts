import { VenueTypeCodeKey } from 'api/gen'
import {
  useVenueTypeCode,
  useVenueTypeCodeActions,
} from 'features/venueMap/store/venueTypeCodeStore'
import { act, renderHook } from 'tests/utils'

describe('venueTypeCodeStore', () => {
  it('should setTypeCode be null on init', async () => {
    const { result: venueTypeCode } = renderHook(useVenueTypeCode)

    expect(venueTypeCode.current).toEqual(null)
  })

  it('should handle setVenueTypeCode', async () => {
    const { result: venueTypeCode } = renderHook(useVenueTypeCode)
    const { result: actions } = renderHook(useVenueTypeCodeActions)

    await act(async () => {
      actions.current.setVenueTypeCode(VenueTypeCodeKey.MOVIE)
    })

    expect(venueTypeCode.current).toEqual(VenueTypeCodeKey.MOVIE)
  })
})
