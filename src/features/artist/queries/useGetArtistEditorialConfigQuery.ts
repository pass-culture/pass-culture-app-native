import { useQuery } from '@tanstack/react-query'

import { fetchArtistEditorialConfig } from 'features/artist/api/fetchArtistEditorialConfig'
import { ArtistEditorialModule } from 'features/home/types'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_ARTIST_EDITORIAL_CONFIG = 60 * 60 * 1000 // 1h

export const useGetArtistEditorialConfigQuery = <TData = ArtistEditorialModule[]>(
  select?: (data: ArtistEditorialModule[]) => TData
) =>
  useQuery<ArtistEditorialModule[], Error, TData>({
    queryKey: [QueryKeys.ARTIST_EDITORIAL_CONFIG],
    queryFn: fetchArtistEditorialConfig,
    select,
    staleTime: STALE_TIME_ARTIST_EDITORIAL_CONFIG,
  })
