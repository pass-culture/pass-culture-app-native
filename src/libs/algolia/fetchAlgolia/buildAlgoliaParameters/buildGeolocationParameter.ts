import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { LocationMode } from 'libs/algolia'
import { SearchQueryParameters } from 'libs/algolia/types'
import { Position } from 'libs/location'

import { RADIUS_FILTERS } from '../../enums'

type Params = {
  locationFilter?: SearchQueryParameters['locationFilter']
  venue?: SearchQueryParameters['venue']
  userLocation: Position
  isFullyDigitalOffersCategory?: SearchQueryParameters['isFullyDigitalOffersCategory']
  enableAppLocation?: boolean
}

export const buildGeolocationParameter = ({
  locationFilter: providedLocationFilter,
  venue,
  userLocation,
  isFullyDigitalOffersCategory,
  enableAppLocation,
}: Params): { aroundLatLng: string; aroundRadius: 'all' | number } | undefined => {
  let locationFilter = providedLocationFilter
  if (isFullyDigitalOffersCategory && enableAppLocation) return
  if (!locationFilter)
    locationFilter = userLocation
      ? { locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS }
      : { locationType: LocationMode.EVERYWHERE }

  if (venue) return

  if (locationFilter.locationType === LocationMode.AROUND_PLACE) {
    if (!locationFilter.place.geolocation) return
    return {
      aroundLatLng: `${locationFilter.place.geolocation.latitude}, ${locationFilter.place.geolocation.longitude}`,
      aroundRadius: computeAroundRadiusInMeters(
        locationFilter.aroundRadius,
        locationFilter.locationType
      ),
    }
  }

  if (!userLocation) return
  if (
    !enableAppLocation &&
    isFullyDigitalOffersCategory &&
    locationFilter.locationType === LocationMode.AROUND_ME
  )
    return
  if (locationFilter.locationType === LocationMode.EVERYWHERE) {
    return {
      aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
      aroundRadius: 'all',
    }
  }

  return {
    aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
    aroundRadius: computeAroundRadiusInMeters(
      locationFilter.aroundRadius,
      locationFilter.locationType
    ),
  }
}

export const computeAroundRadiusInMeters = (
  aroundRadius: number | null,
  locationType: LocationMode
): number | 'all' => {
  if (locationType === LocationMode.EVERYWHERE) return RADIUS_FILTERS.UNLIMITED_RADIUS
  if (aroundRadius === null) return RADIUS_FILTERS.UNLIMITED_RADIUS
  if (aroundRadius === 0) return RADIUS_FILTERS.RADIUS_IN_METERS_FOR_NO_OFFERS
  return aroundRadius * 1000
}
