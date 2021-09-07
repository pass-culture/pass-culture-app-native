import { FilterArray } from '@elastic/app-search-javascript'

import { LocationType } from 'features/search/enums'
import { SearchState } from 'features/search/types'

import { AppSearchFields } from './constants'

export const buildGeolocationFilter = (
  params: SearchState['locationFilter']
): FilterArray<AppSearchFields> => {
  const { aroundRadius, geolocation, locationType } = params

  if (!geolocation) return []
  if (locationType === LocationType.EVERYWHERE) return []
  if (aroundRadius === null) return []

  const center = `${geolocation.latitude}, ${geolocation.longitude}`
  const distance = aroundRadius === 0 ? 1 : aroundRadius
  const unit = aroundRadius === 0 ? 'm' : 'km'
  return [{ [AppSearchFields.venue_position]: { center, distance, unit } }]
}
