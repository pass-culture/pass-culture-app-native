import { useQuery } from 'react-query'

import { VenueTypeCodeKey } from 'api/gen'
import { fetchGTLPlaylistConfig } from 'features/gtlPlaylist/api/fetchGTLPlaylistConfig'
import { GtlPlaylistRequest } from 'features/gtlPlaylist/types'
import { getShouldDisplayGtlPlaylist } from 'features/venue/pages/Venue/getShouldDisplayGtlPlaylist'
import { ContentfulLabelCategories } from 'libs/contentful/types'
import { QueryKeys } from 'libs/queryKeys'

type UseGetGTLPlaylistsConfigQueryArs = {
  searchGroupLabel?: ContentfulLabelCategories
  venueTypeCode?: VenueTypeCodeKey | null
}

const STALE_TIME_GTL_PLAYLIST_CONFIG = 24 * 60 * 1000

export const useGetGTLPlaylistsConfigQuery = <TData = GtlPlaylistRequest[]>(
  { searchGroupLabel, venueTypeCode }: UseGetGTLPlaylistsConfigQueryArs,
  select?: (data: GtlPlaylistRequest[]) => TData
) =>
  useQuery<GtlPlaylistRequest[], Error, TData>(
    [QueryKeys.GTL_PLAYLISTS_CONFIG],
    fetchGTLPlaylistConfig,
    {
      select,
      staleTime: STALE_TIME_GTL_PLAYLIST_CONFIG,
      enabled:
        !!searchGroupLabel ||
        getShouldDisplayGtlPlaylist({
          venueType: venueTypeCode,
        }),
    }
  )
