import { Boosts } from '@elastic/app-search-javascript'

import { GeoCoordinates } from 'libs/geolocation'

import { AppSearchFields } from './constants'

export const buildBoosts = (
  userLocation: GeoCoordinates | null
): Boosts<AppSearchFields> | undefined => {
  if (!userLocation) return
  return {
    [AppSearchFields.venue_position]: {
      type: 'proximity',
      function: 'exponential',
      center: `${userLocation.latitude},${userLocation.longitude}`,
      factor: 10,
    },
  }
}
