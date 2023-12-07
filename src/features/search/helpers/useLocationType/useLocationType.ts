import { LocationType } from 'features/search/enums'
import { SearchState } from 'features/search/types'

export function useLocationType(searchState: SearchState) {
  const { venue, locationFilter } = searchState

  const { locationType } = locationFilter

  const section = venue ? LocationType.PLACE : locationType

  return { locationType, section }
}
