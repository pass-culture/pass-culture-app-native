import { GeolocatedVenue } from 'features/toto/components/VenueMapView/types'
import { calculateRoundRadiusInKilometers } from 'features/toto/helpers/calculateDistanceMap'
import { isGeolocValid } from 'features/toto/helpers/isGeolocValid'
import { useGetAllVenues } from 'features/toto/useGetAllVenues'
import { Region } from 'libs/maps/maps'

export const useGetVenuesInRegion = (
  region: Region,
  selectedVenue: GeolocatedVenue | null
): GeolocatedVenue[] => {
  const radius = calculateRoundRadiusInKilometers(region)
  const { data: venues = [] } = useGetAllVenues({ region, radius })

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
