import { Boosts } from '@elastic/app-search-javascript'

import { GeoCoordinates } from 'libs/geolocation'

import { AppSearchFields, AppSearchVenuesFields } from './constants'

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

export const buildBoostsVenues = (
  userLocation: GeoCoordinates | null
): Boosts<AppSearchVenuesFields> | undefined => {
  if (!userLocation) return
  return {
    [AppSearchVenuesFields.position]: {
      type: 'proximity',
      function: 'exponential',
      center: `${userLocation.latitude},${userLocation.longitude}`,
      factor: 10,
    },
  }
}
