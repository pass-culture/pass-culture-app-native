import { VenueResponse } from 'api/gen'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { transformGeoLocatedVenueToVenueResponse } from 'features/venueMap/helpers/geoLocatedVenueToVenueResponse/geoLocatedVenueToVenueResponse'

describe('transformGeoLocatedVenueToVenueResponse', () => {
  it('should tranform GeolocatedVenue to VenueResponse', () => {
    const geolocatedData = {
      label: 'VENUE',
      _geoloc: {
        lat: 1.1,
        lng: 2.2,
      },
      info: 'INFO',
      venueId: 123,
      isOpenToPublic: true,
    } satisfies GeolocatedVenue

    const expectedVenueResponse = {
      id: geolocatedData.venueId,
      name: geolocatedData.label,
      longitude: geolocatedData._geoloc.lng,
      latitude: geolocatedData._geoloc.lat,
      accessibility: {},
      timezone: '',
      isVirtual: false,
      isOpenToPublic: true,
    } satisfies VenueResponse

    expect(transformGeoLocatedVenueToVenueResponse(geolocatedData)).toMatchObject(
      expectedVenueResponse
    )
  })

  it('should return undefined if no data', () => {
    expect(transformGeoLocatedVenueToVenueResponse(undefined)).toBeUndefined()
  })
})
