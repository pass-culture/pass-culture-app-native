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
        if (!response.ok) {
          throw new Error('Failed to fetch recommendation')
        }
        const responseBody: RecommendedIdsResponse = await response.json()
        return responseBody
      } catch (err) {
        eventMonitoring.captureMessage('Error with recommendation endpoint', {
          level: 'info',
          extra: { url: endpointUrl },
        })

        return { playlist_recommended_offers: [] }
      }
    }
  )
}
