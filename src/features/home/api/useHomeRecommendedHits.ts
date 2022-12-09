import { useEffect, useState } from 'react'

import { computeBeginningAndEndingDatetimes } from 'features/home/api/helpers/computeBeginningAndEndingDatetimes'
import {
  RecommendedIdsRequest,
  useHomeRecommendedIdsMutation,
} from 'features/home/api/useHomeRecommendedIdsMutation'
import { RecommendationParametersFields } from 'libs/contentful'
import { env } from 'libs/environment'
import { GeoCoordinates } from 'libs/geolocation'
import { SearchHit } from 'libs/search'
import { getCategoriesFacetFilters } from 'libs/search/utils'
import { useSubcategoryLabelMapping } from 'libs/subcategories/mappings'
import { SubcategoryLabelMapping } from 'libs/subcategories/types'

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
  parameters: RecommendationParametersFields | undefined,
  subcategoryLabelMapping: SubcategoryLabelMapping
): RecommendedIdsRequest {
  if (!parameters) return {}
  const eventDuringNextXDays = parameters.eventDuringNextXDays
    ? parseInt(parameters.eventDuringNextXDays)
    : undefined
  const { beginningDatetime, endingDatetime } = computeBeginningAndEndingDatetimes({
    ...parameters,
    eventDuringNextXDays,
  })
  return {
    categories: (parameters?.categories || []).map(getCategoriesFacetFilters),
    end_date: endingDatetime,
    isEvent: parameters?.isEvent,
    price_max: parameters?.isFree ? 0 : parameters?.priceMax,
    start_date: beginningDatetime,
    subcategories: (parameters?.subcategories || []).map(
      (subcategoryLabel) => subcategoryLabelMapping[subcategoryLabel]
    ),
    isDuo: parameters.isDuo,
    isRecoShuffled: parameters.isRecoShuffled,
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
  const subcategoryLabelMapping = useSubcategoryLabelMapping()

  useEffect(() => {
    if (!recommendationEndpoint) return
    const requestParameters = getRecommendationParameters(
      recommendationParameters,
      subcategoryLabelMapping
    )
    getRecommendedIds(requestParameters, {
      onSuccess: (response) => setRecommendedIds(response.playlist_recommended_offers),
    })
  }, [getRecommendedIds, recommendationParameters, recommendationEndpoint, subcategoryLabelMapping])

  return useAlgoliaRecommendedHits(recommendedIds || [], moduleId)
}
