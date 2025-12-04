import { SearchGroupNameEnumv2 } from 'api/gen'
import { ACTIVITIES_BY_SEARCH_GROUP } from 'features/search/constants'

export function getActivitiesFromSearchGroup(searchGroup: SearchGroupNameEnumv2) {
  return ACTIVITIES_BY_SEARCH_GROUP[searchGroup] ?? []
}
