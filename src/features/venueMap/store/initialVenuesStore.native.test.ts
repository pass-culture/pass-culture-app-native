import { initialVenuesActions, useInitialVenues } from 'features/venueMap/store/initialVenuesStore'
import { geolocatedVenuesFixture } from 'fixtures/geolocatedVenues'
import { act, renderHook } from 'tests/utils'

describe('initialVenuesStore', () => {
  it('should venues be empty on init', async () => {
    const { result: venues } = renderHook(useInitialVenues)

    expect(venues.current).toEqual([])
  })

  it('should handle setInitialVenues', async () => {
    const { result: venues } = renderHook(useInitialVenues)

    await act(async () => {
      initialVenuesActions.setInitialVenues(geolocatedVenuesFixture)
    })

    expect(venues.current).toEqual(geolocatedVenuesFixture)
  })
})
