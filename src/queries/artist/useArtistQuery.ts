import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { ArtistResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export const useArtistQuery = (artistId: string) =>
  useQuery<ArtistResponse | null, string>({
    queryKey: [QueryKeys.ARTIST, artistId],
    queryFn: async () => {
      try {
        return await api.getNativeV1ArtistsartistId(artistId)
      } catch (error) {
        return null
      }
    },
    staleTime: 60 * 60 * 1000,
  })
