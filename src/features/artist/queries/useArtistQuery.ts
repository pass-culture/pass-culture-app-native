import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { ArtistResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export const useArtistQuery = (artistId: string) =>
  useQuery<ArtistResponse, string>({
    queryKey: [QueryKeys.ARTIST, artistId],
    queryFn: async () => api.getNativeV1ArtistsartistId(artistId),
  })
