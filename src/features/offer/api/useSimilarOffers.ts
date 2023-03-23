import recommend, { RecommendSearchOptions } from '@algolia/recommend'
import { getFrequentlyBoughtTogether, getRelatedProducts } from '@algolia/recommend-core'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Coordinates, SearchGroupNameEnumv2, SearchGroupResponseModelv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useAlgoliaSimilarOffers } from 'features/offer/api/useAlgoliaSimilarOffers'
import { getAlgoliaRecommendParams } from 'features/offer/helpers/getAlgoliaRecommendParams/getAlgoliaRecommendParams'
import { SimilarOffersResponse } from 'features/offer/types'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { eventMonitoring } from 'libs/monitoring'
import { useSubcategories } from 'libs/subcategories/useSubcategories'

const recommendClient = recommend(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_KEY)
const indexName = env.ALGOLIA_OFFERS_INDEX_NAME

type WithIncludeCategoryProps = {
  categoryIncluded: SearchGroupNameEnumv2
  categoryExcluded?: never
}

type WithExcludeCategoryProps = {
  categoryIncluded?: never
  categoryExcluded: SearchGroupNameEnumv2
}

type Props = (WithIncludeCategoryProps | WithExcludeCategoryProps) & {
  offerId?: number
  position?: Coordinates
  shouldUseAlgoliaRecommend?: boolean
}

export const getSimilarOffersEndpoint = (
  offerId?: number,
  userId?: number,
  position?: Coordinates,
  categories?: SearchGroupNameEnumv2[]
): string | undefined => {
  if (!offerId) return
  const endpoint = `${env.RECOMMENDATION_ENDPOINT}/similar_offers/${offerId}?`
  const urlParams = new URLSearchParams()
  urlParams.append('token', env.RECOMMENDATION_TOKEN)
  if (userId) urlParams.append('userId', String(userId))
  if (position) {
    urlParams.append('longitude', String(position.longitude))
    urlParams.append('latitude', String(position.latitude))
  }
  if (categories) categories.forEach((category) => urlParams.append('categories', category))
  return endpoint + urlParams.toString()
}

export const getAlgoliaRelatedProducts = async (
  offerId: string,
  queryParameters: RecommendSearchOptions,
  fallbackParameters: RecommendSearchOptions
) => {
  const relatedProducts = await getRelatedProducts({
    recommendClient,
    indexName,
    objectIDs: [String(offerId)],
    queryParameters,
    fallbackParameters,
  })
    .then((response) => response.recommendations)
    .then((recommendations) => recommendations.map((recommendation) => recommendation.objectID))
    .catch(eventMonitoring.captureException)

  return typeof relatedProducts === 'string' ? [relatedProducts] : relatedProducts || []
}

export const getAlgoliaFrequentlyBoughtTogether = async (
  offerId: string,
  queryParameters: RecommendSearchOptions
) => {
  const frequentlyBoughtTogether = await getFrequentlyBoughtTogether({
    recommendClient,
    indexName,
    objectIDs: [String(offerId)],
    queryParameters,
  })
    .then((response) => response.recommendations)
    .then((recommendations) => recommendations.map((recommendation) => recommendation.objectID))
    .catch(eventMonitoring.captureException)

  return typeof frequentlyBoughtTogether === 'string'
    ? [frequentlyBoughtTogether]
    : frequentlyBoughtTogether || []
}

export const getApiRecoSimilarOffers = async (similarOffersEndpoint: string) => {
  const similarOffers = await fetch(similarOffersEndpoint)
    .then((response) => response.json())
    .then((data: SimilarOffersResponse) => {
      analytics.setDefaultEventParameters(data.params)
      return data.results
    })
    .catch((e) => {
      eventMonitoring.captureException(e)
      return undefined
    })

  return similarOffers
}

export const getCategories = (
  searchGroups?: SearchGroupResponseModelv2[],
  categoryIncluded?: SearchGroupNameEnumv2,
  categoryExcluded?: SearchGroupNameEnumv2
) => {
  if (categoryIncluded) {
    return [categoryIncluded]
  }

  if (categoryExcluded && searchGroups) {
    return searchGroups
      .filter(
        (searchGroup) =>
          searchGroup.name !== categoryExcluded && searchGroup.name !== SearchGroupNameEnumv2.NONE
      )
      .map((searchGroup) => searchGroup.name)
  }

  return []
}

export const useSimilarOffers = ({
  offerId,
  position,
  shouldUseAlgoliaRecommend,
  categoryIncluded,
  categoryExcluded,
}: Props) => {
  const { data } = useSubcategories()

  const categories: SearchGroupNameEnumv2[] = useMemo(
    () => getCategories(data?.searchGroups, categoryIncluded, categoryExcluded),
    [categoryExcluded, categoryIncluded, data?.searchGroups]
  )

  const { user: profile } = useAuthContext()
  const similarOffersEndpoint = getSimilarOffersEndpoint(offerId, profile?.id, position, categories)
  const [similarOffersIds, setSimilarOffersIds] = useState<string[]>()

  const fetchAlgolia = useCallback(async () => {
    if (!offerId) return
    const { queryParameters, fallbackParameters } = getAlgoliaRecommendParams(position, categories)
    setSimilarOffersIds(
      categoryIncluded
        ? await getAlgoliaRelatedProducts(String(offerId), queryParameters, fallbackParameters)
        : await getAlgoliaFrequentlyBoughtTogether(String(offerId), queryParameters)
    )
  }, [categories, categoryIncluded, offerId, position])

  const fetchApiReco = useCallback(async () => {
    if (!similarOffersEndpoint) return
    setSimilarOffersIds(await getApiRecoSimilarOffers(similarOffersEndpoint))
  }, [similarOffersEndpoint])

  useEffect(() => {
    const fetchSimilarOffers = async () => {
      if (shouldUseAlgoliaRecommend) {
        await fetchAlgolia()
      } else {
        await fetchApiReco()
      }
    }

    fetchSimilarOffers()
  }, [fetchAlgolia, fetchApiReco, shouldUseAlgoliaRecommend])

  return useAlgoliaSimilarOffers(similarOffersIds || [])
}
