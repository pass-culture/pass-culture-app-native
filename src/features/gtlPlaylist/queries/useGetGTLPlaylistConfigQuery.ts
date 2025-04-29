import { useQuery } from 'react-query'

import { VenueTypeCodeKey } from 'api/gen'
import { fetchGTLPlaylistConfig } from 'features/gtlPlaylist/api/fetchGTLPlaylistConfig'
import { filterGtlPlaylistConfigByLabel } from 'features/gtlPlaylist/gtlPlaylistHelpers'
import { GtlPlaylistRequest } from 'features/gtlPlaylist/types'
import { ContentfulLabelCategories } from 'libs/contentful/types'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_GTL_PLAYLIST_CONFIG = 24 * 60 * 1000

export const useGetGTLPlaylistConfigQuery = <TData = GtlPlaylistRequest[]>(
  select?: (data: GtlPlaylistRequest[]) => TData
) =>
  useQuery<GtlPlaylistRequest[], Error, TData>([QueryKeys.GTL_PLAYLISTS], fetchGTLPlaylistConfig, {
    select,
    staleTime: STALE_TIME_GTL_PLAYLIST_CONFIG,
  })

export const useGetGTLPlaylistConfigByLabelQuery = (
  searchGroupLabel?: ContentfulLabelCategories,
  venueTypeCode?: VenueTypeCodeKey | null
) =>
  useGetGTLPlaylistConfigQuery((data) =>
    filterGtlPlaylistConfigByLabel(data, venueTypeCode, searchGroupLabel)
  )
