import { ScopeContext } from '@sentry/types'
import { useQuery } from 'react-query'

import { api } from 'api/api'
import { PlaylistRequestBody, PlaylistRequestQuery } from 'api/gen'
import { eventMonitoring } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'

type Parameters = {
  playlistRequestBody: PlaylistRequestBody
  playlistRequestQuery: PlaylistRequestQuery
  userId?: number
}

export const useHomeRecommendedIdsQuery = (parameters: Parameters) => {
  return useQuery(
    [QueryKeys.RECOMMENDATION_OFFER_IDS, parameters],
    async () => {
      try {
        const response = await api.postNativeV1RecommendationPlaylist(
          parameters.playlistRequestBody,
          parameters.playlistRequestQuery.modelEndpoint
            ? parameters.playlistRequestQuery.modelEndpoint
            : undefined,
          parameters.playlistRequestQuery.longitude
            ? parameters.playlistRequestQuery.longitude
            : undefined,
          parameters.playlistRequestQuery.latitude
            ? parameters.playlistRequestQuery.latitude
            : undefined
        )

        const captureContext: Partial<ScopeContext> = {
          level: 'info',
          extra: {
            playlistRequestBody: JSON.stringify(parameters.playlistRequestBody),
            playlistRequestQuery: JSON.stringify(parameters.playlistRequestQuery),
          },
        }

        if (response.playlistRecommendedOffers?.length === 0) {
          eventMonitoring.captureException('Recommended offers playlist is empty', captureContext)
        }

        return response
      } catch (err) {
        eventMonitoring.captureException('Error with recommendation endpoint', {
          extra: {
            playlistRequestBody: JSON.stringify(parameters.playlistRequestBody),
            playlistRequestQuery: JSON.stringify(parameters.playlistRequestQuery),
          },
        })

        return { playlistRecommendedOffers: [], params: undefined }
      }
    },
    { staleTime: 1000 * 60 * 5, enabled: !!parameters?.userId }
  )
}
