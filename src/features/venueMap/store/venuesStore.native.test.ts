import { useVenues, useVenuesActions } from 'features/venueMap/store/venuesStore'
import { geolocatedVenuesFixture } from 'fixtures/geolocatedVenues'
import { act, renderHook } from 'tests/utils'

describe('venuesStore', () => {
  it('should venues be empty on init', async () => {
    const { result: venues } = renderHook(useVenues)

    expect(venues.current).toEqual([])
  })

  it('should handle setVenues', async () => {
    const { result: venues } = renderHook(useVenues)
    const { result: actions } = renderHook(useVenuesActions)

    await act(async () => {
      actions.current.setVenues(geolocatedVenuesFixture)
    })

    expect(venues.current).toEqual(geolocatedVenuesFixture)
  })
})
