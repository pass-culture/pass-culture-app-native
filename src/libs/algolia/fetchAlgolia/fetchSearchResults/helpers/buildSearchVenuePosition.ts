import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { LocationFilter } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { LocationMode } from 'libs/algolia'
import { Position } from 'libs/location'

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
  geolocPosition?: Position,
  venue?: Venue
) {
  let searchVenuePosition: SearchVenuePositionType = { aroundRadius: 'all' }

  if (geolocPosition) {
    if (locationFilter?.locationType === LocationMode.AROUND_ME) {
      const aroundRadius = locationFilter.aroundRadius ?? 'all'

      searchVenuePosition = {
        aroundLatLng: `${geolocPosition.latitude}, ${geolocPosition.longitude}`,
        aroundRadius: convertKmToMeters(aroundRadius),
      }
    }
    if (locationFilter?.locationType === LocationMode.EVERYWHERE) {
      searchVenuePosition = {
        ...searchVenuePosition,
        aroundLatLng: `${geolocPosition.latitude}, ${geolocPosition.longitude}`,
      }
    }
  }

  if (
    locationFilter?.locationType === LocationMode.AROUND_PLACE &&
    locationFilter?.place?.geolocation
  ) {
    const placePosition = locationFilter?.place?.geolocation

    searchVenuePosition = {
      aroundLatLng: `${placePosition.latitude}, ${placePosition.longitude}`,
      aroundRadius: convertKmToMeters(locationFilter?.aroundRadius),
    }
  }

  if (venue?._geoloc) {
    const venuePosition = venue._geoloc

    searchVenuePosition = {
      aroundLatLng: `${venuePosition.lat}, ${venuePosition.lng}`,
      aroundRadius: convertKmToMeters(MAX_RADIUS),
    }
  }

  return searchVenuePosition
}
