import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { isAPIExceptionNotCaptured } from 'api/apiHelpers'
import { Position } from 'libs/location/location'
import { eventMonitoring } from 'libs/monitoring/services'
import { QueryKeys } from 'libs/queryKeys'

type Props = {
  offerId: number
  shouldFetch: boolean
  position?: Position
  userId?: string
}

export const useOfferPagePlaylistsQuery = ({ offerId, shouldFetch, position, userId }: Props) => {
  return useQuery({
    queryKey: [QueryKeys.OFFER_PAGE_PLAYLISTS, offerId, position, userId],
    queryFn: async () => {
      try {
        return await api.getNativeV1RecommendationOfferPagePlaylistsofferId(
          offerId,
          userId,
          position?.longitude,
          position?.latitude
        )
      } catch (err) {
        const statusCode = err instanceof ApiError ? err.statusCode : 'unknown'
        const errorMessage = err instanceof Error ? err.message : JSON.stringify(err)
        const shouldApiErrorNotCaptured = Boolean(
          err instanceof ApiError && isAPIExceptionNotCaptured(err.statusCode)
        )

        if (!shouldApiErrorNotCaptured) {
          eventMonitoring.captureException(
            new Error(
              `Error ${statusCode} with offer page playlists endpoint to get recommended offers`
            ),
            {
              extra: {
                offerId,
                userId,
                longitude: position?.longitude,
                latitude: position?.latitude,
                statusCode,
                errorMessage,
              },
            }
          )
        }

        return { fromCache: false, offerId: String(offerId), playlists: [] }
      }
    },
    staleTime: 1000 * 60 * 5,
    enabled: shouldFetch,
  })
}
