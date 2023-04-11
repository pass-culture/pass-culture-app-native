import { LocationType } from 'features/search/enums'
import { SearchState } from 'features/search/types'
import { Position } from 'libs/geolocation'

import { RADIUS_FILTERS } from '../../enums'

export const buildGeolocationParameter = (
  locationFilter: SearchState['locationFilter'],
  userLocation: Position,
  isOnline?: SearchState['isOnline']
): { aroundLatLng: string; aroundRadius: 'all' | number } | undefined => {
  if (locationFilter.locationType === LocationType.VENUE) return

  if (locationFilter.locationType === LocationType.PLACE) {
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
  if (isOnline && locationFilter.locationType === LocationType.AROUND_ME) return
  if (locationFilter.locationType === LocationType.EVERYWHERE) {
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

const computeAroundRadiusInMeters = (
  aroundRadius: number | null,
  locationType: LocationType
): number | 'all' => {
  if (locationType === LocationType.EVERYWHERE) return RADIUS_FILTERS.UNLIMITED_RADIUS
  if (aroundRadius === null) return RADIUS_FILTERS.UNLIMITED_RADIUS
  if (aroundRadius === 0) return RADIUS_FILTERS.RADIUS_IN_METERS_FOR_NO_OFFERS
  return aroundRadius * 1000
}
