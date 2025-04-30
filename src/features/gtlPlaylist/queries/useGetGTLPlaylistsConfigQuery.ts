import { useQuery } from 'react-query'

import { fetchGTLPlaylistConfig } from 'features/gtlPlaylist/api/fetchGTLPlaylistConfig'
import { GtlPlaylistRequest } from 'features/gtlPlaylist/types'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_GTL_PLAYLIST_CONFIG = 24 * 60 * 1000

export const useGetGTLPlaylistsConfigQuery = <TData = GtlPlaylistRequest[]>(
  select?: (data: GtlPlaylistRequest[]) => TData
) =>
  useQuery<GtlPlaylistRequest[], Error, TData>(
    [QueryKeys.GTL_PLAYLISTS_CONFIG],
    fetchGTLPlaylistConfig,
    {
      select,
      staleTime: STALE_TIME_GTL_PLAYLIST_CONFIG,
    }
  )
