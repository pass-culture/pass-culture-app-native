import {
  useInitialVenues,
  useInitialVenuesActions,
} from 'features/venueMap/store/initialVenuesStore'
import { geolocatedVenuesFixture } from 'fixtures/geolocatedVenues'
import { act, renderHook } from 'tests/utils'

describe('initialVenuesStore', () => {
  it('should venues be empty on init', async () => {
    const { result: venues } = renderHook(useInitialVenues)

    expect(venues.current).toEqual([])
  })

  it('should handle setInitialVenues', async () => {
    const { result: venues } = renderHook(useInitialVenues)
    const { result: actions } = renderHook(useInitialVenuesActions)

    await act(async () => {
      actions.current.setInitialVenues(geolocatedVenuesFixture)
    })

    expect(venues.current).toEqual(geolocatedVenuesFixture)
  })
})
