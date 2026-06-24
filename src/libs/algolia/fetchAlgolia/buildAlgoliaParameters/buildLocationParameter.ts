import { RADIUS_FILTERS } from 'libs/algolia/enums/radiusFiltersEnums'
import { LocationMode } from 'libs/algolia/types'
import { Position } from 'libs/location/location'

export type AlgoliaPositionParams = {
  aroundLatLng: string
  aroundRadius?: RADIUS_FILTERS.UNLIMITED_RADIUS | number
}

export type BuildLocationParameterParams = {
  selectedLocationMode: LocationMode
  userLocation: Position
  aroundMeRadius?: number | 'all'
  aroundPlaceRadius?: number | 'all'
  geolocPosition?: Position
}

export const buildLocationParameter = ({
  selectedLocationMode,
  userLocation,
  aroundMeRadius = 'all',
  aroundPlaceRadius = 'all',
}: BuildLocationParameterParams): AlgoliaPositionParams | undefined => {
  if (!userLocation) return

  const aroundLatLng = `${userLocation.latitude}, ${userLocation.longitude}`

  if (selectedLocationMode === LocationMode.EVERYWHERE) {
    return { aroundLatLng, aroundRadius: RADIUS_FILTERS.UNLIMITED_RADIUS }
  }

  if (selectedLocationMode === LocationMode.AROUND_ME) {
    if (aroundMeRadius === undefined) return { aroundLatLng }
    return { aroundLatLng, aroundRadius: getRadius(aroundMeRadius) }
  }

  if (selectedLocationMode === LocationMode.AROUND_PLACE) {
    if (aroundPlaceRadius === undefined) return { aroundLatLng }
    return { aroundLatLng, aroundRadius: getRadius(aroundPlaceRadius) }
  }

  return { aroundLatLng }
}

export const buildLocationParameterForSearch = ({
  geolocPosition,
  selectedLocationMode,
  userLocation,
  aroundMeRadius,
  aroundPlaceRadius,
}: BuildLocationParameterParams): AlgoliaPositionParams | undefined => {
  if (geolocPosition && selectedLocationMode === LocationMode.EVERYWHERE) {
    return {
      aroundLatLng: `${geolocPosition.latitude}, ${geolocPosition.longitude}`,
      aroundRadius: RADIUS_FILTERS.UNLIMITED_RADIUS,
    }
  }

  return buildLocationParameter({
    selectedLocationMode,
    userLocation,
    aroundMeRadius,
    aroundPlaceRadius,
  })
}

const computeAroundRadiusInMeters = (aroundRadius: number): number => {
  if (aroundRadius === 0) return RADIUS_FILTERS.RADIUS_IN_METERS_FOR_NO_OFFERS
  return Math.round(aroundRadius * 1000)
}

const getRadius = (radius: number | 'all') => {
  return radius === 'all' ? RADIUS_FILTERS.UNLIMITED_RADIUS : computeAroundRadiusInMeters(radius)
}
