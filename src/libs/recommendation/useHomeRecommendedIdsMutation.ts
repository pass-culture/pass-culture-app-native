import { ScopeContext } from '@sentry/types'
import { useMutation } from 'react-query'

import { eventMonitoring } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'
import { RecommendedIdsRequest, RecommendedIdsResponse } from 'libs/recommendation/types'

export const useHomeRecommendedIdsMutation = () => {
  return useMutation(
    [QueryKeys.RECOMMENDATION_OFFER_IDS],
    async (parameters: RecommendedIdsRequest) => {
      const { endpointUrl, ...requestBodyParams } = parameters
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
          level: 'info',
          extra: { url: endpointUrl, status: response.status },
        }
        if (!response.ok) {
          eventMonitoring.captureMessage('Recommendation response was not ok', captureContext)
        }
        const responseBody: RecommendedIdsResponse = await response.json()
        if (responseBody?.playlist_recommended_offers?.length === 0) {
          eventMonitoring.captureMessage('Recommended offers playlist is empty', captureContext)
        }
        return responseBody
      } catch (err) {
        eventMonitoring.captureException('Error with recommendation endpoint', {
          extra: { url: endpointUrl, stack: err },
        })

        return { playlist_recommended_offers: [] }
      }
    }
  )
}
