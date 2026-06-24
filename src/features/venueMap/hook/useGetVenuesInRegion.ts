import { Venue } from 'features/venue/types'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
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
  const { data: venues } = useVenuesInRegionQuery<GeolocatedVenue[] | undefined>({
    region,
    select,
  })

  return venues
}
