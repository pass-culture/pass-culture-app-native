import { VenueTypeCodeKey } from 'api/gen'
import { Store, useVenueMapStore } from 'features/venueMap/context/useVenueMapStore'
import { geolocatedVenuesFixture } from 'fixtures/geolocatedVenues'
import { act, renderHook } from 'tests/utils'

describe('VenueMap reducer', () => {
  it('should handle setVenueTypeCode', async () => {
    const { result } = renderHook<Store, void>(useVenueMapStore)

    await act(async () => {
      result.current.setVenueTypeCode(VenueTypeCodeKey.MOVIE)
    })

    expect(result.current.venueTypeCode).toEqual(VenueTypeCodeKey.MOVIE)
  })

  it('should handle setVenues', async () => {
    const { result } = renderHook<Store, void>(useVenueMapStore)

    await act(async () => {
      result.current.setVenues(geolocatedVenuesFixture)
    })

    expect(result.current.venues).toEqual(geolocatedVenuesFixture)
  })

  it('should handle setSelectedVenue', async () => {
    const { result } = renderHook<Store, void>(useVenueMapStore)

    await act(async () => {
      // @ts-expect-error: because of noUncheckedIndexedAccess
      result.current.setSelectedVenue(geolocatedVenuesFixture[0])
    })

    expect(result.current.selectedVenue).toEqual(geolocatedVenuesFixture[0])
  })
})
