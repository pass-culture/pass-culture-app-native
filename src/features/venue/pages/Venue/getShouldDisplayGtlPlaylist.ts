import { Activity, SearchGroupNameEnumv2 } from 'api/gen'

const activityWithGtlPlaylist = [
  Activity.DISTRIBUTION_STORE,
  Activity.BOOKSTORE,
  Activity.RECORD_STORE,
]

const searchGroupsWithGtlPlaylist = [SearchGroupNameEnumv2.LIVRES, SearchGroupNameEnumv2.MUSIQUE]

export const getShouldDisplayGtlPlaylist = ({
  activity,
  searchGroup,
}: {
  activity?: Activity | null
  searchGroup?: SearchGroupNameEnumv2
}) => {
  if (activity) return activityWithGtlPlaylist.includes(activity)
  return searchGroup ? searchGroupsWithGtlPlaylist.includes(searchGroup) : false
}
