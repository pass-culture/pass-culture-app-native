import { LocationMode } from 'libs/algolia'
import { RADIUS_FILTERS } from 'libs/algolia/enums'
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
