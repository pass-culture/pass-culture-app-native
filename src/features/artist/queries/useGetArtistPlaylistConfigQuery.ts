import { useQuery } from '@tanstack/react-query'

import { fetchArtistPlaylistConfig } from 'features/artist/api/fetchArtistPlaylistConfig'
import { ArtistPlaylistModule } from 'features/home/types'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_ARTIST_PLAYLIST_CONFIG = 24 * 60 * 1000

export const useGetArtistPlaylistConfigQuery = <TData = ArtistPlaylistModule[]>(
  select?: (data: ArtistPlaylistModule[]) => TData
) =>
  useQuery<ArtistPlaylistModule[], Error, TData>({
    queryKey: [QueryKeys.ARTIST_PLAYLIST_CONFIG],
    queryFn: fetchArtistPlaylistConfig,
    select,
    staleTime: STALE_TIME_ARTIST_PLAYLIST_CONFIG,
  })
