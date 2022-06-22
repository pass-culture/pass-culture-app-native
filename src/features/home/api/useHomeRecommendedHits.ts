import { useEffect, useState } from 'react'

import {
  RecommendedIdsRequest,
  useHomeRecommendedIdsMutation,
} from 'features/home/api/useHomeRecommendedIdsMutation'
import { RecommendationParametersFields } from 'features/home/contentful'
import { env } from 'libs/environment'
import { GeoCoordinates } from 'libs/geolocation'
import { SearchHit } from 'libs/search'
import { getCategoriesFacetFilters } from 'libs/search/utils'

import { useAlgoliaRecommendedHits } from './useAlgoliaRecommendedHits'

export const getRecommendationEndpoint = (
  userId: number | undefined,
  position: GeoCoordinates | null
): string | undefined => {
  if (!userId) return undefined
  const endpoint = `${env.RECOMMENDATION_ENDPOINT}/playlist_recommendation/${userId}?token=${env.RECOMMENDATION_TOKEN}`
  if (position) return `${endpoint}&longitude=${position.longitude}&latitude=${position.latitude}`
  return endpoint
}

export function getRecommendationParameters(
  parameters: RecommendationParametersFields | undefined
): RecommendedIdsRequest {
  if (!parameters) return {}
  return {
    categories: (parameters?.categories || []).map(getCategoriesFacetFilters),
    end_date: parameters?.endingDatetime,
    isEvent: parameters?.isEvent,
    price_max: parameters?.isFree ? 0 : parameters?.priceMax,
    start_date: parameters?.beginningDatetime,
  }
}

export const useHomeRecommendedHits = (
  userId: number | undefined,
  position: GeoCoordinates | null,
  moduleId: string,
  recommendationParameters?: RecommendationParametersFields
): SearchHit[] | undefined => {
  const recommendationEndpoint = getRecommendationEndpoint(userId, position) as string
  const [recommendedIds, setRecommendedIds] = useState<string[]>()
  const { mutate: getRecommendedIds } = useHomeRecommendedIdsMutation(recommendationEndpoint)

  useEffect(() => {
    if (!recommendationEndpoint) return
    const requestParameters = getRecommendationParameters(recommendationParameters)
    getRecommendedIds(requestParameters, {
      onSuccess: (response) => setRecommendedIds(response.playlist_recommended_offers),
    })
  }, [getRecommendedIds, recommendationParameters, recommendationEndpoint])

  return useAlgoliaRecommendedHits(recommendedIds || [], moduleId)
}
