import { Venue } from 'features/venue/types'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { isGeolocValid } from 'features/venueMap/helpers/isGeolocValid'

export function getGeolocatedVenues(venues: Venue[], selectedVenue?: GeolocatedVenue | null) {
  const geolocatedVenues = venues.filter(
    (venue): venue is GeolocatedVenue => !!(venue.venueId && isGeolocValid(venue._geoloc))
  )

  const hasSelectionOutsideSearchArea =
    selectedVenue && !geolocatedVenues.find((venue) => venue.venueId === selectedVenue.venueId)
  if (hasSelectionOutsideSearchArea) {
    geolocatedVenues.push(selectedVenue)
  }

  return geolocatedVenues
}
