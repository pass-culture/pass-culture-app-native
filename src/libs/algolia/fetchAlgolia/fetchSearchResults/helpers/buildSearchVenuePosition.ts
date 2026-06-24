import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { Venue } from 'features/venue/types'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { LocationMode } from 'libs/algolia/types'

type SearchVenuePositionType = {
  aroundLatLng?: string
  aroundRadius?: number | 'all'
}

export function convertKmToMeters(aroundRadiusKm?: number | 'all') {
  if (aroundRadiusKm === undefined) return undefined
  if (aroundRadiusKm === 'all' || aroundRadiusKm === 0) return 'all'
  return aroundRadiusKm * 1000
}

export function buildSearchVenuePosition(
  buildLocationParameterParams: BuildLocationParameterParams,
  venue?: Venue
) {
  const { selectedLocationMode, userLocation } = buildLocationParameterParams

  let searchVenuePosition: SearchVenuePositionType = { aroundRadius: 'all' }

  if (userLocation) {
    const aroundLatLng = `${userLocation.latitude}, ${userLocation.longitude}`

    searchVenuePosition =
      selectedLocationMode === LocationMode.EVERYWHERE
        ? { aroundLatLng, aroundRadius: 'all' }
        : { aroundLatLng }
  }

  if (venue?._geoloc) {
    const { lat: latitude, lng: longitude } = venue._geoloc

    if (latitude && longitude) {
      searchVenuePosition = {
        aroundLatLng: `${latitude}, ${longitude}`,
        aroundRadius: convertKmToMeters(MAX_RADIUS),
      }
    }
  }

  return searchVenuePosition
}
