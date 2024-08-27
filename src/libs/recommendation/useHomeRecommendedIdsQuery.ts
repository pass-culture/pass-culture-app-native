import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { PlaylistRequestBody, PlaylistRequestQuery } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { eventMonitoring } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'

type Parameters = {
  playlistRequestBody: PlaylistRequestBody
  playlistRequestQuery: PlaylistRequestQuery
  userId?: number
}

export const useHomeRecommendedIdsQuery = (parameters: Parameters) => {
  const { playlistRequestBody, playlistRequestQuery, userId } = parameters
  const { modelEndpoint, longitude, latitude } = playlistRequestQuery
  const stringifyPlaylistRequestBody = JSON.stringify(playlistRequestBody)
  const stringifyPlaylistRequestQuery = JSON.stringify(playlistRequestQuery)
  const { isLoggedIn } = useAuthContext()

  return useQuery(
    [QueryKeys.RECOMMENDATION_OFFER_IDS, parameters],
    async () => {
      try {
        const response = await api.postNativeV1RecommendationPlaylist(
          playlistRequestBody,
          modelEndpoint ?? undefined,
          longitude ?? undefined,
          latitude ?? undefined
        )

        return response
      } catch (err) {
        const statusCode = err instanceof ApiError ? err.statusCode : 'unknown'
        const errorMessage = err instanceof Error ? err.message : JSON.stringify(err)

        eventMonitoring.captureException(
          new Error(`Error ${statusCode} with recommendation endpoint`),
          {
            extra: {
              playlistRequestBody: stringifyPlaylistRequestBody,
              playlistRequestQuery: stringifyPlaylistRequestQuery,
              statusCode: statusCode,
              errorMessage,
            },
          }
        )

        return { playlistRecommendedOffers: [], params: undefined }
      }
    },
    { staleTime: 1000 * 60 * 5, enabled: isLoggedIn && !!userId }
  )
}
