import { SearchGroupNameEnumv2 } from 'api/gen'
import { VENUE_TYPES_BY_SEARCH_GROUP } from 'features/search/constants'

export function getVenueTypesFromSearchGroup(searchGroup: SearchGroupNameEnumv2) {
  return VENUE_TYPES_BY_SEARCH_GROUP[searchGroup] ?? []
}
