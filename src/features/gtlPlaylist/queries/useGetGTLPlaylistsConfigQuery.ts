import { useQuery } from '@tanstack/react-query'

import { fetchGTLPlaylistConfig } from 'features/gtlPlaylist/api/fetchGTLPlaylistConfig'
import { GtlPlaylistRequest } from 'features/gtlPlaylist/types'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_GTL_PLAYLIST_CONFIG = 24 * 60 * 1000

export const useGetGTLPlaylistsConfigQuery = <TData = GtlPlaylistRequest[]>(
  enabledQuery: boolean,
  select?: (data: GtlPlaylistRequest[]) => TData
) =>
  useQuery<GtlPlaylistRequest[], Error, TData>({
    queryKey: [QueryKeys.GTL_PLAYLISTS_CONFIG],
    queryFn: fetchGTLPlaylistConfig,
    select,
    staleTime: STALE_TIME_GTL_PLAYLIST_CONFIG,
    enabled: enabledQuery,
  })
