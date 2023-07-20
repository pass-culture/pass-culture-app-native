import { LocationType } from 'features/search/enums'
import { SearchQueryParameters } from 'libs/algolia/types'
import { Position } from 'libs/geolocation'

export const adaptGeolocationParameters = (
  geolocation: Position,
  isGeolocated?: boolean,
  aroundRadius?: number
): SearchQueryParameters['locationFilter'] | undefined => {
  const notGeolocatedButRadiusIsProvided = !isGeolocated && aroundRadius
  const geolocatedButGeolocationIsInvalid = isGeolocated && !geolocation

  if (notGeolocatedButRadiusIsProvided || geolocatedButGeolocationIsInvalid) return

  return isGeolocated && geolocation
    ? { locationType: LocationType.AROUND_ME, aroundRadius: aroundRadius || null }
    : { locationType: LocationType.EVERYWHERE }
}
