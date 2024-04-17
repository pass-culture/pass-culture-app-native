import { ScopeContext } from '@sentry/types'
import { useQuery } from 'react-query'

import { eventMonitoring } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'
import { RecommendedIdsRequest, RecommendedIdsResponse } from 'libs/recommendation/types'

type Parameters = Omit<RecommendedIdsRequest, 'endpointUrl'> & { endpointUrl?: string }

export const useHomeRecommendedIdsQuery = (parameters: Parameters) => {
  return useQuery(
    [QueryKeys.RECOMMENDATION_OFFER_IDS, parameters],
    async () => {
      const { endpointUrl, ...requestBodyParams } = parameters
      if (!endpointUrl) return { playlist_recommended_offers: [] }

      try {
        const response = await fetch(endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(requestBodyParams),
        })
        const captureContext: Partial<ScopeContext> = {
          extra: { url: endpointUrl, status: response.status },
        }
        if (!response.ok) {
          eventMonitoring.logInfo('Recommendation response was not ok', captureContext)
        }
        const responseBody: RecommendedIdsResponse = await response.json()
        if (responseBody?.playlist_recommended_offers?.length === 0) {
          eventMonitoring.logInfo('Recommended offers playlist is empty', captureContext)
        }
        return responseBody
      } catch (err) {
        eventMonitoring.captureException('Error with recommendation endpoint', {
          extra: { url: endpointUrl, stack: err },
        })

        return { playlist_recommended_offers: [] }
      }
    },
    { staleTime: 1000 * 60 * 5, enabled: !!parameters.endpointUrl }
  )
}
