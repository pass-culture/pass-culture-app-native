import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { VenuesCountByType } from 'features/venueMap/types'

export function getVenuesNumberByType(venues: GeolocatedVenue[]) {
  const uniqueVenuesTypes = Array.from(new Set(venues.map((venue) => venue.venue_type)))

  const venuesCountByType: Partial<VenuesCountByType> = {}
  uniqueVenuesTypes.forEach((type) => {
    if (type !== null && type !== undefined) {
      venuesCountByType[type] = venues.filter((venue) => venue.venue_type === type).length
    }
  })

  return venuesCountByType
}
