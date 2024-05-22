import {
  useSelectedVenue,
  useSelectedVenueActions,
} from 'features/venueMap/store/selectedVenueStore'
import { geolocatedVenuesFixture } from 'fixtures/geolocatedVenues'
import { act, renderHook } from 'tests/utils'

describe('selectedVenueStore', () => {
  it('should be null on init', async () => {
    const { result: selectedVenue } = renderHook(useSelectedVenue)

    expect(selectedVenue.current).toEqual(null)
  })

  it('should handle setSelectedVenue', async () => {
    const { result: selectedVenue } = renderHook(useSelectedVenue)
    const { result: actions } = renderHook(useSelectedVenueActions)

    await act(async () => {
      // @ts-expect-error: because of noUncheckedIndexedAccess
      actions.current.setSelectedVenue(geolocatedVenuesFixture[0])
    })

    expect(selectedVenue.current).toEqual(geolocatedVenuesFixture[0])
  })

  it('should handle removeSelectedVenue', async () => {
    const { result: selectedVenue } = renderHook(useSelectedVenue)
    const { result: actions } = renderHook(useSelectedVenueActions)
    await act(async () => {
      // @ts-expect-error: because of noUncheckedIndexedAccess
      actions.current.setSelectedVenue(geolocatedVenuesFixture[0])
    })

    await act(async () => {
      actions.current.removeSelectedVenue()
    })

    expect(selectedVenue.current).toEqual(null)
  })
})
