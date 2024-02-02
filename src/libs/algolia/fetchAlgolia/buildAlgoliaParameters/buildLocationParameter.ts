import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { LocationMode } from 'libs/algolia'
import { RADIUS_FILTERS } from 'libs/algolia/enums'
import { SearchQueryParameters } from 'libs/algolia/types'
import { Position } from 'libs/location'

type AlgoliaPositionParams = {
  aroundLatLng: string
  aroundRadius: RADIUS_FILTERS.UNLIMITED_RADIUS | number
}

export type BuildLocationParameterParams = {
  selectedLocationMode: LocationMode
  userLocation: Position
  aroundMeRadius: number | 'all'
  aroundPlaceRadius: number | 'all'
}
export const buildLocationParameter = ({
  selectedLocationMode,
  userLocation,
  aroundMeRadius,
  aroundPlaceRadius,
}: BuildLocationParameterParams): AlgoliaPositionParams | undefined => {
  if (!userLocation) return
  const positionParams: AlgoliaPositionParams = {
    aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
    aroundRadius: RADIUS_FILTERS.UNLIMITED_RADIUS,
  }
  switch (selectedLocationMode) {
    case LocationMode.AROUND_ME:
      positionParams.aroundRadius =
        aroundMeRadius === 'all'
          ? RADIUS_FILTERS.UNLIMITED_RADIUS
          : computeAroundRadiusInMeters(aroundMeRadius)
      break
    case LocationMode.AROUND_PLACE:
      positionParams.aroundRadius =
        aroundPlaceRadius === 'all'
          ? RADIUS_FILTERS.UNLIMITED_RADIUS
          : computeAroundRadiusInMeters(aroundPlaceRadius)
      break
    case LocationMode.EVERYWHERE:
      break
  }
  return positionParams
}

const computeAroundRadiusInMeters = (
  aroundRadius: number
): number | RADIUS_FILTERS.UNLIMITED_RADIUS => {
  if (aroundRadius === 0) return RADIUS_FILTERS.RADIUS_IN_METERS_FOR_NO_OFFERS
  return aroundRadius * 1000
}

type BuildGeolocationParameterParams = {
  locationFilter?: SearchQueryParameters['locationFilter']
  venue?: SearchQueryParameters['venue']
  userLocation: Position
  aroundRadius?: number
}

// @deprecated use buildLocationParameter
// TODO(PC-25239): try to delete when removing feature flag
export const deprecatedBuildGeolocationParameter = ({
  locationFilter: providedLocationFilter,
  venue,
  userLocation,
  aroundRadius,
}: BuildGeolocationParameterParams): AlgoliaPositionParams | undefined => {
  let locationFilter = providedLocationFilter
  if (!locationFilter)
    locationFilter = userLocation
      ? { locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS }
      : { locationType: LocationMode.EVERYWHERE }

  if (venue) return

  if (locationFilter.locationType === LocationMode.AROUND_PLACE) {
    if (!locationFilter.place.geolocation) return
    return {
      aroundLatLng: `${locationFilter.place.geolocation.latitude}, ${locationFilter.place.geolocation.longitude}`,
      aroundRadius: deprecatedComputeAroundRadiusInMeters(
        locationFilter.aroundRadius,
        locationFilter.locationType
      ),
    }
  }

  if (!userLocation) return

  if (locationFilter.locationType === LocationMode.EVERYWHERE) {
    return {
      aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
      aroundRadius: aroundRadius ?? RADIUS_FILTERS.UNLIMITED_RADIUS,
    }
  }

  return {
    aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
    aroundRadius: deprecatedComputeAroundRadiusInMeters(
      locationFilter.aroundRadius,
      locationFilter.locationType
    ),
  }
}
// @deprecated use computeAroundRadiusInMeters
export const deprecatedComputeAroundRadiusInMeters = (
  aroundRadius: number | null,
  locationType: LocationMode
): number | RADIUS_FILTERS.UNLIMITED_RADIUS => {
  if (locationType === LocationMode.EVERYWHERE) return RADIUS_FILTERS.UNLIMITED_RADIUS
  if (aroundRadius === null) return RADIUS_FILTERS.UNLIMITED_RADIUS
  if (aroundRadius === 0) return RADIUS_FILTERS.RADIUS_IN_METERS_FOR_NO_OFFERS
  return aroundRadius * 1000
}
