import { Venue } from 'features/venue/types'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { calculateRoundRadiusInKilometers } from 'features/venueMap/helpers/calculateDistanceMap'
import { getGeolocatedVenues } from 'features/venueMap/helpers/getGeolocatedVenues/getGeolocatedVenues'
import { useGetAllVenues } from 'features/venueMap/useGetAllVenues'
import { Region } from 'libs/maps/maps'

export const useGetVenuesInRegion = (
  region: Region,
  selectedVenue: GeolocatedVenue | null,
  initialVenues?: Venue[]
): GeolocatedVenue[] => {
  const radius = calculateRoundRadiusInKilometers(region)
  const { venues = [] } = useGetAllVenues({ region, radius, initialVenues })

  return getGeolocatedVenues(venues, selectedVenue)
}
