import { VenueTypeCodeKey } from 'api/gen'
import { initialVenueMapState, venueMapReducer } from 'features/venueMap/context/reducer'
import { geolocatedVenuesFixture } from 'fixtures/geolocatedVenues'

describe('VenueMap reducer', () => {
  const state = initialVenueMapState

  it('should handle SET_VENUE_TYPE_CODE', () => {
    const newState = venueMapReducer(state, {
      type: 'SET_VENUE_TYPE_CODE',
      payload: VenueTypeCodeKey.MOVIE,
    })

    expect(newState).toStrictEqual({ ...state, venueTypeCode: VenueTypeCodeKey.MOVIE })
  })

  it('should handle SET_VENUES', () => {
    const newState = venueMapReducer(state, {
      type: 'SET_VENUES',
      payload: geolocatedVenuesFixture,
    })

    expect(newState).toStrictEqual({ ...state, venues: geolocatedVenuesFixture })
  })

})
