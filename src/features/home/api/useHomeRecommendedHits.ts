import { useState, useEffect } from 'react'

import { buildRecommendationOfferTypesList } from 'features/home/api/helpers/buildRecommendationOfferTypesList'
import { computeBeginningAndEndingDatetimes } from 'features/home/api/helpers/computeBeginningAndEndingDatetimes'
import { getRecommendationEndpoint } from 'features/home/api/helpers/getRecommendationEndpoint'
import { RecommendedOffersModule } from 'features/home/types'
import { SearchHit } from 'libs/algolia'
import { getCategoriesFacetFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/getCategoriesFacetFilters'
import { GeoCoordinates } from 'libs/geolocation'
import { RecommendedIdsRequest } from 'libs/recommendation/types'
import { useHomeRecommendedIdsMutation } from 'libs/recommendation/useHomeRecommendedIdsMutation'
import { useSubcategoryLabelMapping } from 'libs/subcategories/mappings'
import { SubcategoryLabelMapping } from 'libs/subcategories/types'

import { useAlgoliaRecommendedHits } from './useAlgoliaRecommendedHits'

export function getRecommendationParameters(
  parameters: RecommendedOffersModule['recommendationParameters'] | undefined,
  subcategoryLabelMapping: SubcategoryLabelMapping
): Omit<RecommendedIdsRequest, 'endpointUrl'> {
  if (!parameters) return {}
  const eventDuringNextXDays = parameters.eventDuringNextXDays
    ? parameters.eventDuringNextXDays
    : undefined
  const { beginningDatetime, endingDatetime } = computeBeginningAndEndingDatetimes({
    ...parameters,
    eventDuringNextXDays,
  })

  const offertTypeValue = buildRecommendationOfferTypesList({
    bookTypes: parameters.bookTypes,
    movieGenres: parameters.movieGenres,
    musicTypes: parameters.musicTypes,
  })
  return {
    categories: (parameters?.categories || []).map(getCategoriesFacetFilters),
    end_date: endingDatetime,
    isEvent: parameters?.isEvent,
    price_min: parameters?.priceMin,
    price_max: parameters?.priceMax,
    start_date: beginningDatetime,
    subcategories: (parameters?.subcategories || []).map(
      (subcategoryLabel) => subcategoryLabelMapping[subcategoryLabel]
    ),
    isDuo: parameters.isDuo,
    isRecoShuffled: parameters.isRecoShuffled,
    offerTypeList: offertTypeValue,
  }
}

export const useHomeRecommendedHits = (
  userId: number | undefined,
  position: GeoCoordinates | null,
  moduleId: string,
  recommendationParameters?: RecommendedOffersModule['recommendationParameters']
): SearchHit[] | undefined => {
  const recommendationEndpoint = getRecommendationEndpoint({
    userId,
    position,
    modelEndpoint: recommendationParameters?.modelEndpoint,
  })
  const [recommendedIds, setRecommendedIds] = useState<string[]>()
  const { mutate: getRecommendedIds } = useHomeRecommendedIdsMutation()
  const subcategoryLabelMapping = useSubcategoryLabelMapping()

  useEffect(() => {
    if (!recommendationEndpoint) return
    const requestParameters = getRecommendationParameters(
      recommendationParameters,
      subcategoryLabelMapping
    )
    getRecommendedIds(
      { ...requestParameters, endpointUrl: recommendationEndpoint },
      {
        onSuccess: (response) => setRecommendedIds(response.playlist_recommended_offers),
      }
    )
  }, [getRecommendedIds, recommendationParameters, recommendationEndpoint, subcategoryLabelMapping])

  return useAlgoliaRecommendedHits(recommendedIds || [], moduleId)
}
