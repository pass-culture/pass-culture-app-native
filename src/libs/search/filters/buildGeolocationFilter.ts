import { FilterArray } from '@elastic/app-search-javascript'

import { LocationType } from 'features/search/enums'
import { SearchState } from 'features/search/types'
import { GeoCoordinates } from 'libs/geolocation'

import { AppSearchFields } from './constants'

export const buildGeolocationFilter = (
  locationFilter: SearchState['locationFilter'],
  userLocation: GeoCoordinates | null
): FilterArray<AppSearchFields> => {
  if (locationFilter.locationType === LocationType.EVERYWHERE) return []
  if (locationFilter.locationType === LocationType.VENUE) return []

  if (!userLocation || locationFilter.aroundRadius === null) return []

  const distance = locationFilter.aroundRadius === 0 ? 1 : locationFilter.aroundRadius
  const unit = locationFilter.aroundRadius === 0 ? 'm' : 'km'

  const center =
    locationFilter.locationType === LocationType.AROUND_ME
      ? userLocation
      : locationFilter.place.geolocation

  if (!center) return []
  return [
    {
      [AppSearchFields.venue_position]: {
        center: `${center.latitude}, ${center.longitude}`,
        distance,
        unit,
      },
    },
  ]
}
