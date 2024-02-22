import { OffersModuleParameters } from 'features/home/types'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { LocationMode } from 'libs/algolia/types'
import { Position } from 'libs/location'

export const adaptOffersPlaylistLocationParameters = (
  parameters: OffersModuleParameters,
  userLocation: Position,
  selectedLocationMode: LocationMode
): BuildLocationParameterParams => {
  const { isGeolocated, aroundRadius } = parameters

  const radius = isGeolocated && !!aroundRadius ? aroundRadius : 'all'

  return {
    selectedLocationMode,
    userLocation,
    aroundMeRadius: radius,
    aroundPlaceRadius: radius,
  }
}
