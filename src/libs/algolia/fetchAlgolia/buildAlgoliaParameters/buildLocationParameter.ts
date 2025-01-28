import { RADIUS_FILTERS } from 'libs/algolia/enums/radiusFiltersEnums'
import { LocationMode } from 'libs/algolia/types'
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
  geolocPosition?: Position
  forSearch?: boolean
}
export const buildLocationParameter = ({
  selectedLocationMode,
  userLocation,
  aroundMeRadius,
  aroundPlaceRadius,
  forSearch,
  geolocPosition,
}: BuildLocationParameterParams): AlgoliaPositionParams | undefined => {
  console.log({ userLocation }) // WIP : userLocation est forcement undefined si locationmode=> everywhere. Verifier aussi la geoloc ici ?
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
      if (forSearch && geolocPosition) {
        positionParams.aroundRadius = RADIUS_FILTERS.UNLIMITED_RADIUS
      }
      break
  }
  return positionParams
}

const computeAroundRadiusInMeters = (
  aroundRadius: number
): number | RADIUS_FILTERS.UNLIMITED_RADIUS => {
  if (aroundRadius === 0) return RADIUS_FILTERS.RADIUS_IN_METERS_FOR_NO_OFFERS
  // Algolia API needs an integer: https://www.algolia.com/doc/api-reference/api-parameters/aroundRadius/#options
  return Math.round(aroundRadius * 1000)
}
