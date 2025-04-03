import { Venue } from 'features/venue/types'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { calculateRoundRadiusInKilometers } from 'features/venueMap/helpers/calculateDistanceMap'
import { isGeolocValid } from 'features/venueMap/helpers/isGeolocValid'
import { Region } from 'libs/maps/maps'
import { useVenuesInRegionQuery } from 'queries/venueMap/useVenuesInRegionQuery'

const select = (data: Venue[] | undefined) => {
  return data?.filter(
    (venue): venue is GeolocatedVenue => !!(venue.venueId && isGeolocValid(venue._geoloc))
  )
}

export const useGetVenuesInRegion = (
  region: Region = {} as Region
): GeolocatedVenue[] | undefined => {
  const radius = calculateRoundRadiusInKilometers(region)

  const { data: venues } = useVenuesInRegionQuery<GeolocatedVenue[] | undefined>({
    region,
    radius,
    select,
  })

  return venues
}
