import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { useIsUserUnderageBeneficiary } from 'features/profile/utils'
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

export const useHomeRecommendedHits = (
  userId: number | undefined,
  position: GeoCoordinates | null
): SearchHit[] | undefined => {
  const { data: recommendedIds } = useRecommendedOfferIds(userId, position)
  return useRecommendedHits(recommendedIds?.recommended_offers || [])
}

export const getRecommendationEndpoint = (
  userId: number | undefined,
  position: GeoCoordinates | null
): string | undefined => {
  if (!userId) return undefined
  const endpoint = `${env.RECOMMENDATION_ENDPOINT}/recommendation/${userId}?token=${env.RECOMMENDATION_TOKEN}`

  if (position) return `${endpoint}&longitude=${position.longitude}&latitude=${position.latitude}`
  return endpoint
}

const useRecommendedOfferIds = (userId: number | undefined, position: GeoCoordinates | null) => {
  const recommendationEndpoint = getRecommendationEndpoint(userId, position) as string

  return useQuery(
    QueryKeys.RECOMMENDATION_OFFER_IDS,
    async () => {
      try {
        const response = await fetch(recommendationEndpoint)
        return response.json() as Promise<{ recommended_offers: string[] }>
      } catch (err) {
        eventMonitoring.captureException(
          new Error(`Error with recommendation endpoint: ${recommendationEndpoint}.`)
        )
        return { recommended_offers: [] }
      }
    },
    { enabled: typeof userId === 'number' && !!recommendationEndpoint }
  )
}

const useRecommendedHits = (ids: string[]): SearchHit[] | undefined => {
  const isUserUnderage = useIsUserUnderageBeneficiary()
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
