import { VenueTypeCodeKey } from 'api/gen'
import { filterGtlPlaylistConfigByLabel } from 'features/gtlPlaylist/gtlPlaylistHelpers'
import { useGetGTLPlaylistsConfigQuery } from 'features/gtlPlaylist/queries/useGetGTLPlaylistsConfigQuery'
import { ContentfulLabelCategories } from 'libs/contentful/types'

export const useGetGTLPlaylistsConfigByLabelQuery = (
  searchGroupLabel?: ContentfulLabelCategories,
  venueTypeCode?: VenueTypeCodeKey | null
) =>
  useGetGTLPlaylistsConfigQuery({ searchGroupLabel, venueTypeCode }, (data) =>
    filterGtlPlaylistConfigByLabel(data, venueTypeCode, searchGroupLabel)
  )
