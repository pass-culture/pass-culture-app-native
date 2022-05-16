import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'

import { RecommendationParametersFields } from 'features/home/contentful'
import { useIsUserUnderage } from 'features/profile/utils'
import {
  fetchAlgoliaHits,
  filterAlgoliaHit,
  useTransformAlgoliaHits,
} from 'libs/algolia/fetchAlgolia'
import { env } from 'libs/environment'
import { GeoCoordinates } from 'libs/geolocation'
import { eventMonitoring } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'
import { IncompleteSearchHit, SearchHit } from 'libs/search'
import { getCategoriesFacetFilters } from 'libs/search/utils'

interface RecommendedIdsResponse {
  playlist_recommended_offers: string[]
}

interface RecommendedIdsRequest {
  start_date?: string
  end_date?: string
  isEvent?: boolean
  categories?: string[]
  price_max?: number
}

export const useHomeRecommendedHits = (
  userId: number | undefined,
  position: GeoCoordinates | null,
  parameters?: RecommendationParametersFields
): SearchHit[] | undefined => {
  const recommendationEndpoint = getRecommendationEndpoint(userId, position) as string
  const [recommendedIds, setRecommendedIds] = useState<string[]>()
  const { mutate: getRecommendedIds } = useHomeRecommendedIdsMutation(recommendationEndpoint)

  useEffect(() => {
    const recommendationParameters = getRecommendationParameters(parameters)
    getRecommendedIds(recommendationParameters, {
      onSuccess: (response) => setRecommendedIds(response.playlist_recommended_offers),
    })
  }, [getRecommendedIds, parameters])

  return useRecommendedHits(recommendedIds || [])
}

export const getRecommendationEndpoint = (
  userId: number | undefined,
  position: GeoCoordinates | null
): string | undefined => {
  if (!userId) return undefined
  const endpoint = `${env.RECOMMENDATION_ENDPOINT}/playlist_recommendation/${userId}?token=${env.RECOMMENDATION_TOKEN}`

  if (position) return `${endpoint}&longitude=${position.longitude}&latitude=${position.latitude}`
  return endpoint
}

export const useHomeRecommendedIdsMutation = (recommendationUrl: string) => {
  return useMutation(
    QueryKeys.RECOMMENDATION_OFFER_IDS,
    async (parameters: RecommendedIdsRequest) => {
      try {
        const response = await fetch(recommendationUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(parameters),
        })
        if (!response.ok) {
          throw new Error('Failed to fetch recommendation')
        }
        const responseBody: RecommendedIdsResponse = await response.json()
        return responseBody
      } catch (err) {
        eventMonitoring.captureException(new Error('Error with recommendation endpoint'), {
          extra: { url: recommendationUrl },
        })
        return { playlist_recommended_offers: [] }
      }
    }
  )
}

const useRecommendedHits = (ids: string[]): SearchHit[] | undefined => {
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformAlgoliaHits()

  const { data: hits } = useQuery(
    QueryKeys.RECOMMENDATION_HITS,
    async () => await fetchAlgoliaHits(ids, isUserUnderage),
    { enabled: ids.length > 0 }
  )

  return useMemo(() => {
    if (!hits) return

    return (hits as IncompleteSearchHit[])
      .filter(filterAlgoliaHit)
      .map(transformHits) as SearchHit[]
  }, [hits, transformHits])
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
