import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { Venue } from 'features/venue/types'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { LocationMode } from 'libs/algolia/types'

type SearchVenuePositionType = {
  aroundLatLng?: string
  aroundRadius: number | 'all'
}

export function convertKmToMeters(aroundRadiusKm: number | 'all') {
  if (aroundRadiusKm === 'all' || aroundRadiusKm === 0) {
    return 'all'
  }
  return aroundRadiusKm * 1000
}

export function buildSearchVenuePosition(
  buildLocationParameterParams: BuildLocationParameterParams,
  venue?: Venue
) {
  const { selectedLocationMode, userLocation, aroundMeRadius, aroundPlaceRadius } =
    buildLocationParameterParams

  let searchVenuePosition: SearchVenuePositionType = { aroundRadius: 'all' }
  if (userLocation) {
    switch (selectedLocationMode) {
      case LocationMode.AROUND_ME:
        searchVenuePosition = {
          aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
          aroundRadius: convertKmToMeters(aroundMeRadius),
        }
        break
      case LocationMode.EVERYWHERE:
        searchVenuePosition = {
          aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
          aroundRadius: 'all',
        }
        break
      case LocationMode.AROUND_PLACE:
        searchVenuePosition = {
          aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
          aroundRadius: convertKmToMeters(aroundPlaceRadius),
        }
        break

      default:
        break
    }
  }

  if (venue?._geoloc) {
    const venuePosition = venue._geoloc
    const latitude = venuePosition.lat
    const longitude = venuePosition.lng

    if (latitude && longitude) {
      searchVenuePosition = {
        aroundLatLng: `${latitude}, ${longitude}`,
        aroundRadius: convertKmToMeters(MAX_RADIUS),
      }
    }
  }

  return searchVenuePosition
}
