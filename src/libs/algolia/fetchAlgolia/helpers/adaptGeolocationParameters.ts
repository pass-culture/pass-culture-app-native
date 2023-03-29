import { LocationType } from 'features/search/enums'
import { SearchState } from 'features/search/types'
import { GeoCoordinates } from 'libs/geolocation'

export const adaptGeolocationParameters = (
  geolocation: GeoCoordinates | null,
  isGeolocated?: boolean,
  aroundRadius?: number
): SearchState['locationFilter'] | undefined => {
  const notGeolocatedButRadiusIsProvided = !isGeolocated && aroundRadius
  const geolocatedButGeolocationIsInvalid = isGeolocated && !geolocation

  if (notGeolocatedButRadiusIsProvided || geolocatedButGeolocationIsInvalid) return

  return isGeolocated && geolocation
    ? { locationType: LocationType.AROUND_ME, aroundRadius: aroundRadius || null }
    : { locationType: LocationType.EVERYWHERE }
}
