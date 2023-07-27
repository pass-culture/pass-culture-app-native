import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { LocationFilter } from 'features/search/types'
import { Position } from 'libs/geolocation'

type SearchVenuePositionType = {
  aroundLatLng?: string
  aroundRadius: number | 'all'
}

export function buildSearchVenuePosition(locationFilter?: LocationFilter, userPosition?: Position) {
  let searchVenuePosition: SearchVenuePositionType = { aroundRadius: 'all' }
  if (userPosition && locationFilter?.locationType === LocationType.AROUND_ME) {
    searchVenuePosition = {
      aroundLatLng: `${userPosition.latitude}, ${userPosition.longitude}`,
      aroundRadius: locationFilter?.aroundRadius ?? 'all',
    }
  }
  if (locationFilter?.locationType === LocationType.PLACE && locationFilter?.place?.geolocation) {
    const placePosition = locationFilter?.place?.geolocation
    searchVenuePosition = {
      aroundLatLng: `${placePosition.latitude}, ${placePosition.longitude}`,
      aroundRadius: locationFilter?.aroundRadius,
    }
  }
  if (locationFilter?.locationType === LocationType.VENUE && locationFilter?.venue?._geoloc) {
    const placePosition = locationFilter?.venue?._geoloc
    searchVenuePosition = {
      aroundLatLng: `${placePosition.lat}, ${placePosition.lng}`,
      aroundRadius: MAX_RADIUS,
    }
  }

  return searchVenuePosition
}
