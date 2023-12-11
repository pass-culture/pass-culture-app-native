import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { AlgoliaLocationFilter, Geoloc } from 'libs/algolia/types'
import { LocationMode, Position } from 'libs/location/types'

export type AdaptAlgoliaLocationFilterParameters = {
  userPosition: Position
  selectedLocationMode: LocationMode
  aroundPlaceRadius: number | null
  aroundMeRadius: number | null
  venuePosition?: Geoloc
}
export const computeAroundRadiusInMeters = (aroundRadius: number): number => {
  if (aroundRadius === 0) return 1
  return aroundRadius * 1000
}

export const adaptAlgoliaLocationFilter = ({
  userPosition,
  selectedLocationMode,
  aroundPlaceRadius,
  aroundMeRadius,
  venuePosition,
}: AdaptAlgoliaLocationFilterParameters): AlgoliaLocationFilter => {
  if (venuePosition) {
    return {
      aroundLatLng: `${venuePosition.lat}, ${venuePosition.lng}`,
      aroundRadius: computeAroundRadiusInMeters(MAX_RADIUS),
    }
  }

  if (!userPosition) return
  const aroundLatLng = `${userPosition.latitude}, ${userPosition.longitude}`
  let aroundRadius: number | 'all' = 'all'
  switch (selectedLocationMode) {
    case LocationMode.AROUND_PLACE:
      if (aroundPlaceRadius) aroundRadius = computeAroundRadiusInMeters(aroundPlaceRadius)
      break
    case LocationMode.AROUND_ME:
      if (aroundMeRadius) aroundRadius = computeAroundRadiusInMeters(aroundMeRadius)
      break
    case LocationMode.EVERYWHERE:
      aroundRadius = 'all'
      break

    default:
      break
  }

  return {
    aroundLatLng,
    aroundRadius,
  }
}
