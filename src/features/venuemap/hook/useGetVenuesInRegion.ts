import { GeolocatedVenue } from 'features/venuemap/components/VenueMapView/types'
import { calculateRoundRadiusInKilometers } from 'features/venuemap/helpers/calculateDistanceMap'
import { isGeolocValid } from 'features/venuemap/helpers/isGeolocValid'
import { useGetAllVenues } from 'features/venuemap/useGetAllVenues'
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
