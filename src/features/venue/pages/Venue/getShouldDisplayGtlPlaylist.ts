import { SearchGroupNameEnumv2, VenueTypeCodeKey } from 'api/gen'

const venueTypesWithGtlPlaylist = [
  VenueTypeCodeKey.DISTRIBUTION_STORE,
  VenueTypeCodeKey.BOOKSTORE,
  VenueTypeCodeKey.RECORD_STORE,
]

const searchGroupsWithGtlPlaylist = [SearchGroupNameEnumv2.LIVRES, SearchGroupNameEnumv2.MUSIQUE]

export const getShouldDisplayGtlPlaylist = ({
  venueType,
  searchGroup,
}: {
  venueType?: VenueTypeCodeKey | null
  searchGroup?: SearchGroupNameEnumv2
}) => {
  if (venueType) return venueTypesWithGtlPlaylist.includes(venueType)
  return searchGroup ? searchGroupsWithGtlPlaylist.includes(searchGroup) : false
}
