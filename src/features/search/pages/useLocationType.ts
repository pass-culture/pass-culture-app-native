import { LocationType } from 'features/search/enums'
import { SearchState } from 'features/search/types'

export function useLocationType(searchState: SearchState) {
  const { locationFilter } = searchState

  const { locationType } = locationFilter

  const section = locationType === LocationType.VENUE ? LocationType.PLACE : locationType

  return { locationFilter, locationType, section }
}
