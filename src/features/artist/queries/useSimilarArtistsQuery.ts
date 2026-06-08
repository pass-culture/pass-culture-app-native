import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { Artist } from 'features/venue/types'
import { QueryKeys } from 'libs/queryKeys'

type Options = {
  enabled?: boolean
}

export const useSimilarArtistsQuery = (artistId: string, { enabled = true }: Options = {}) =>
  useQuery({
    queryKey: [QueryKeys.SIMILAR_ARTISTS, artistId],
    queryFn: () => api.getNativeV1ArtistsartistIdSimilar(artistId),
    enabled: !!artistId && enabled,
    select: (data): Artist[] =>
      data.artists.map((similarArtist) => ({
        id: similarArtist.id,
        name: similarArtist.name,
        image: similarArtist.image ?? undefined,
      })),
  })
