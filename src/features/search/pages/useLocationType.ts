import { LocationType } from 'features/search/enums'
import { SearchState } from 'features/search/types'

export function useLocationType(searchState: SearchState) {
  const { locationFilter } = searchState
  const { locationType } = locationFilter
  // PLACE and VENUE belong to the same section
  const section = locationType === LocationType.VENUE ? LocationType.PLACE : locationType
  return { locationFilter, locationType, section }
}
