import { Venue } from 'features/venue/types'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { getGeolocatedVenues } from 'features/venueMap/helpers/getGeolocatedVenues/getGeolocatedVenues'
import { geolocatedVenuesFixture } from 'fixtures/geolocatedVenues'

describe('getGeolocatedVenues', () => {
  it('should return geolocated venues', () => {
    const venues: Venue[] = [
      {
        ...geolocatedVenuesFixture[0],
        _geoloc: { lat: 48 },
        venueId: null,
      } as Venue,
      geolocatedVenuesFixture[1] as Venue,
    ]
    const geolocatedVenues = getGeolocatedVenues(venues, null)

    expect(geolocatedVenues).toEqual([venues[1]])
  })

  it('should return geolocated venues when a venue is selected and is not in venues in parameter', () => {
    const geolocatedVenues = getGeolocatedVenues(
      geolocatedVenuesFixture.slice(1),
      geolocatedVenuesFixture[0] as GeolocatedVenue
    )

    expect(geolocatedVenues).toEqual([
      ...geolocatedVenuesFixture.slice(1),
      geolocatedVenuesFixture[0],
    ])
  })
})
