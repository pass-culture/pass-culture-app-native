import { SearchState } from 'features/search/types'
import { LocationMode } from 'libs/location/types'

export function useLocationType(searchState: SearchState) {
  const { venue, locationFilter } = searchState

  const { locationType } = locationFilter

  const section = venue ? LocationMode.AROUND_PLACE : locationType

  return { locationType, section }
}
