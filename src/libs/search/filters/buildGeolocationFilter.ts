import { FilterArray } from '@elastic/app-search-javascript'

import { LocationType } from 'features/search/enums'
import { SearchParameters } from 'features/search/types'

import { AppSearchFields } from './constants'

// Filter okey on search
export const buildGeolocationFilter = (params: SearchParameters): FilterArray<AppSearchFields> => {
  const { aroundRadius, geolocation, locationType } = params

  if (!geolocation) return []
  if (locationType === LocationType.EVERYWHERE) return []
  if (aroundRadius === null) return []

  const center = `${geolocation.latitude}, ${geolocation.longitude}`
  const distance = aroundRadius === 0 ? 1 : aroundRadius
  const unit = aroundRadius === 0 ? 'm' : 'km'
  return [{ [AppSearchFields.geoloc]: { center, distance, unit } }]
}
