import { useVenues, venuesActions } from 'features/venueMap/store/venuesStore'
import { geolocatedVenuesFixture } from 'fixtures/geolocatedVenues'
import { act, renderHook } from 'tests/utils'

describe('venuesStore', () => {
  it('should venues be empty on init', async () => {
    const { result: venues } = renderHook(useVenues)

    expect(venues.current).toEqual([])
  })

  it('should handle setVenues', async () => {
    const { result: venues } = renderHook(useVenues)

    await act(() => {
      venuesActions.setVenues(geolocatedVenuesFixture)
    })

    expect(venues.current).toEqual(geolocatedVenuesFixture)
  })
})
