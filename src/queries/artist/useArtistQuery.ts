import { useSuspenseQuery, useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { ArtistResponse } from 'api/gen'
import { eventMonitoring } from 'libs/monitoring/services'
import { QueryKeys } from 'libs/queryKeys'

export const useArtistSuspenseQuery = (artistId: string) =>
  useSuspenseQuery<ArtistResponse, string>({
    queryKey: [QueryKeys.ARTIST, artistId],
    queryFn: async () => api.getNativeV1ArtistsartistId(artistId),
  })

export const useArtistQuery = (artistId: string, { throwOnError = true } = {}) =>
  useQuery<ArtistResponse, string>({
    queryKey: [QueryKeys.ARTIST, artistId],
    queryFn: async () => {
      try {
        return await api.getNativeV1ArtistsartistId(artistId)
      } catch (error) {
        eventMonitoring.captureException(error)
        throw error
      }
    },
    throwOnError,
  })
