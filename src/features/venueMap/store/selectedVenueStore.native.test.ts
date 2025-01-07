import { selectedVenueActions, useSelectedVenue } from 'features/venueMap/store/selectedVenueStore'
import { geolocatedVenuesFixture } from 'fixtures/geolocatedVenues'
import { act, renderHook } from 'tests/utils'

describe('selectedVenueStore', () => {
  it('should be null on init', async () => {
    const { result: selectedVenue } = renderHook(useSelectedVenue)

    expect(selectedVenue.current).toEqual(null)
  })

  it('should handle setSelectedVenue', async () => {
    const { result: selectedVenue } = renderHook(useSelectedVenue)

    await act(async () => {
      // @ts-expect-error: because of noUncheckedIndexedAccess
      selectedVenueActions.setSelectedVenue(geolocatedVenuesFixture[0])
    })

    expect(selectedVenue.current).toEqual(geolocatedVenuesFixture[0])
  })

  it('should handle removeSelectedVenue', async () => {
    const { result: selectedVenue } = renderHook(useSelectedVenue)
    await act(async () => {
      // @ts-expect-error: because of noUncheckedIndexedAccess
      selectedVenueActions.setSelectedVenue(geolocatedVenuesFixture[0])
      selectedVenueActions.removeSelectedVenue()
    })

    expect(selectedVenue.current).toEqual(null)
  })
})
