import { RADIUS_FILTERS } from 'libs/algolia/enums/radiusFiltersEnums'
import { LocationMode } from 'libs/algolia/types'
import { Position } from 'libs/location/location'

export type AlgoliaPositionParams = {
  aroundLatLng: string
  aroundRadius: RADIUS_FILTERS.UNLIMITED_RADIUS | number
}

export type BuildLocationParameterParams = {
  selectedLocationMode: LocationMode
  userLocation: Position
  aroundMeRadius: number | 'all'
  aroundPlaceRadius: number | 'all'
  geolocPosition?: Position
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
      positionParams.aroundRadius = getRadius(aroundMeRadius)
      break
    case LocationMode.AROUND_PLACE:
      positionParams.aroundRadius = getRadius(aroundPlaceRadius)
      break
    default:
      break
  }
  return positionParams
}

export const buildLocationParameterForSearch = ({
  geolocPosition,
  selectedLocationMode,
  userLocation,
  aroundMeRadius,
  aroundPlaceRadius,
}: BuildLocationParameterParams): AlgoliaPositionParams | undefined => {
  return geolocPosition && selectedLocationMode === LocationMode.EVERYWHERE
    ? {
        aroundLatLng: `${geolocPosition.latitude}, ${geolocPosition.longitude}`,
        aroundRadius: RADIUS_FILTERS.UNLIMITED_RADIUS,
      }
    : buildLocationParameter({
        selectedLocationMode,
        userLocation,
        aroundMeRadius,
        aroundPlaceRadius,
      })
}

const computeAroundRadiusInMeters = (aroundRadius: number): number => {
  if (aroundRadius === 0) return RADIUS_FILTERS.RADIUS_IN_METERS_FOR_NO_OFFERS
  // Algolia API needs an integer: https://www.algolia.com/doc/api-reference/api-parameters/aroundRadius/#options
  return Math.round(aroundRadius * 1000)
}

const getRadius = (radius: number | 'all') => {
  return radius === 'all' ? RADIUS_FILTERS.UNLIMITED_RADIUS : computeAroundRadiusInMeters(radius)
}
