import { OffersModuleParameters } from 'features/home/types'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { LocationMode } from 'libs/algolia/types'
import { Position } from 'libs/location/location'

export const adaptOffersPlaylistLocationParameters = (
  parameters: OffersModuleParameters,
  userLocation: Position
): BuildLocationParameterParams => {
  const { isGeolocated, aroundRadius } = parameters

  const radius = isGeolocated && !!aroundRadius ? aroundRadius : 'all'

  const selectedLocationMode =
    aroundRadius && isGeolocated ? LocationMode.AROUND_ME : LocationMode.EVERYWHERE

  return {
    selectedLocationMode,
    userLocation,
    aroundMeRadius: radius,
    aroundPlaceRadius: radius,
  }
}
