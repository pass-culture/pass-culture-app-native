import { GeoCoordinates } from 'react-native-geolocation-service'
import { useQuery } from 'react-query'

import { env } from 'libs/environment'
import { errorMonitoring } from 'libs/errorMonitoring'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit, useFetchHits } from 'libs/search'

import { useUserProfileInfo } from '../api'
import { RecommendationPane } from '../contentful/moduleTypes'

export const useHomeRecommendedHits = (
  recommendationModule: RecommendationPane | undefined
): SearchHit[] => {
  const { data: recommendedIds } = useRecommendedOfferIds(recommendationModule)
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

const useRecommendationEndpoint = (userId: number | undefined) => {
  const { position } = useGeolocation()
  return getRecommendationEndpoint(userId, position) as string
}

const useRecommendedOfferIds = (recommendationModule: RecommendationPane | undefined) => {
  const { data: profile } = useUserProfileInfo()
  const userId = profile?.id
  const recommendationEndpoint = useRecommendationEndpoint(userId)

  return useQuery(
    QueryKeys.RECOMMENDATION_OFFER_IDS,
    async () => {
      const response = await fetch(recommendationEndpoint)
      if (response.ok) {
        return response.json() as Promise<{ recommended_offers: string[] }>
      } else {
        errorMonitoring.captureException(
          new Error(
            `Error with recommendation endpoint: ${recommendationEndpoint}. status code ${response.status}`
          )
        )
        return { recommended_offers: [] }
      }
    },
    { enabled: !!recommendationModule && typeof userId === 'number' && !!recommendationEndpoint }
  )
}

const useRecommendedHits = (ids: string[]): SearchHit[] => {
  const { enabled, fetchHits, transformHits, filterHits } = useFetchHits()

  const { data } = useQuery(QueryKeys.RECOMMENDATION_HITS, async () => await fetchHits(ids), {
    enabled: ids.length > 0 && enabled,
  })

  const results = data?.results || []
  return (results as SearchHit[]).filter(filterHits).map(transformHits)
}
