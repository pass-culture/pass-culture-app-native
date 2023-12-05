import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { LocationFilter } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { Position } from 'libs/geolocation'

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
  locationFilter?: LocationFilter,
  userPosition?: Position,
  venue?: Venue
) {
  let searchVenuePosition: SearchVenuePositionType = { aroundRadius: 'all' }

  if (userPosition) {
    if (locationFilter?.locationType === LocationType.AROUND_ME) {
      const aroundRadius = locationFilter.aroundRadius ?? 'all'

      searchVenuePosition = {
        aroundLatLng: `${userPosition.latitude}, ${userPosition.longitude}`,
        aroundRadius: convertKmToMeters(aroundRadius),
      }
    }
    if (locationFilter?.locationType === LocationType.EVERYWHERE) {
      searchVenuePosition = {
        ...searchVenuePosition,
        aroundLatLng: `${userPosition.latitude}, ${userPosition.longitude}`,
      }
    }
  }

  if (locationFilter?.locationType === LocationType.PLACE && locationFilter?.place?.geolocation) {
    const placePosition = locationFilter?.place?.geolocation

    searchVenuePosition = {
      aroundLatLng: `${placePosition.latitude}, ${placePosition.longitude}`,
      aroundRadius: convertKmToMeters(locationFilter?.aroundRadius),
    }
  }

  if (venue && venue?._geoloc) {
    const venuePosition = venue._geoloc

    searchVenuePosition = {
      aroundLatLng: `${venuePosition.lat}, ${venuePosition.lng}`,
      aroundRadius: convertKmToMeters(MAX_RADIUS),
    }
  }

  return searchVenuePosition
}
