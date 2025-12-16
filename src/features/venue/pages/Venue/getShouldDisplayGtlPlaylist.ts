import { Activity, SearchGroupNameEnumv2 } from 'api/gen'

const activityWithGtlPlaylist = new Set<Activity>([
  Activity.DISTRIBUTION_STORE,
  Activity.BOOKSTORE,
  Activity.RECORD_STORE,
])

const searchGroupsWithGtlPlaylist = new Set<SearchGroupNameEnumv2>([
  SearchGroupNameEnumv2.LIVRES,
  SearchGroupNameEnumv2.MUSIQUE,
])

export const getShouldDisplayGtlPlaylist = ({
  activity,
  searchGroup,
}: {
  activity?: Activity | null
  searchGroup?: SearchGroupNameEnumv2
}) => {
  if (activity) return activityWithGtlPlaylist.has(activity)
  return searchGroup ? searchGroupsWithGtlPlaylist.has(searchGroup) : false
}
