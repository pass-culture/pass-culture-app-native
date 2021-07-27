import { Boosts } from '@elastic/app-search-javascript'

import { SearchParameters } from 'features/search/types'

import { AppSearchFields } from './constants'

export const buildBoosts = (
  position: SearchParameters['geolocation']
): Boosts<AppSearchFields> | undefined => {
  if (!position) return
  return {
    [AppSearchFields.venue_position]: {
      type: 'proximity',
      function: 'exponential',
      center: `${position.latitude},${position.longitude}`,
      factor: 10,
    },
  }
}
