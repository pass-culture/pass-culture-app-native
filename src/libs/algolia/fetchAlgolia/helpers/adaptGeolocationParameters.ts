import { LocationMode } from 'libs/algolia'
import { SearchQueryParameters } from 'libs/algolia/types'
import { Position } from 'libs/location'

export const adaptGeolocationParameters = (
  geolocation: Position,
  isGeolocated?: boolean,
  aroundRadius?: number
): SearchQueryParameters['locationFilter'] | undefined => {
  const notGeolocatedButRadiusIsProvided = !isGeolocated && aroundRadius
  const geolocatedButGeolocationIsInvalid = isGeolocated && !geolocation

  if (notGeolocatedButRadiusIsProvided || geolocatedButGeolocationIsInvalid) return

  return isGeolocated && geolocation
    ? { locationType: LocationMode.AROUND_ME, aroundRadius: aroundRadius || null }
    : { locationType: LocationMode.EVERYWHERE }
}
