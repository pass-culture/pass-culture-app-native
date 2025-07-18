import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { ArtistResponse } from 'api/gen'
import { eventMonitoring } from 'libs/monitoring/services'
import { QueryKeys } from 'libs/queryKeys'

export const useArtistQuery = (artistId: string) => {
  return useQuery<ArtistResponse, string>({
    queryKey: [QueryKeys.ARTIST, artistId],
    queryFn: async () => api.getNativeV1ArtistsartistId(artistId),
    onError: (error: string) => {
      eventMonitoring.captureException(error)
    },
  })
}
