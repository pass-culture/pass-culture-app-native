import { Boosts, ProximityBoost } from '@elastic/app-search-javascript'

import { LocationFilter } from 'features/search/types'
import { GeoCoordinates } from 'libs/geolocation'

import { AppSearchFields } from './constants'

const getProximityBoost = (userLocation: GeoCoordinates): ProximityBoost => ({
  type: 'proximity',
  function: 'exponential',
  center: `${userLocation.latitude},${userLocation.longitude}`,
  factor: 10,
})

const isSearchFilteredAroundUserPosition = (locationFilter: LocationFilter): boolean =>
  'aroundRadius' in locationFilter && typeof locationFilter['aroundRadius'] === 'number'

export const buildBoosts = (
  userLocation: GeoCoordinates | null,
  locationFilter: LocationFilter
): Boosts<AppSearchFields> | undefined => {
  if (!userLocation || !isSearchFilteredAroundUserPosition(locationFilter)) return
  return { [AppSearchFields.venue_position]: getProximityBoost(userLocation) }
}
