import { SubcategoryIdEnumv2 } from 'api/gen'
import { buildRecommendationOfferTypesList } from 'features/home/api/helpers/buildRecommendationOfferTypesList'
import { computeBeginningAndEndingDatetimes } from 'features/home/api/helpers/computeBeginningAndEndingDatetimes'
import { getRecommendationEndpoint } from 'features/home/api/helpers/getRecommendationEndpoint'
import { RecommendedOffersModule } from 'features/home/types'
import { getCategoriesFacetFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/getCategoriesFacetFilters'
import { Position } from 'libs/location'
import { RecommendedIdsRequest } from 'libs/recommendation/types'
import { useHomeRecommendedIdsQuery } from 'libs/recommendation/useHomeRecommendedIdsQuery'
import { useSubcategoryLabelMapping } from 'libs/subcategories/mappings'
import { SubcategoryLabelMapping } from 'libs/subcategories/types'
import { Offer, RecommendationApiParams } from 'shared/offer/types'

import { useAlgoliaRecommendedOffers } from './useAlgoliaRecommendedOffers'

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
    showTypes: parameters.showTypes,
  })
  return {
    categories: (parameters?.categories ?? []).map(getCategoriesFacetFilters),
    end_date: endingDatetime,
    isEvent: parameters?.isEvent,
    price_min: parameters?.priceMin,
    price_max: parameters?.priceMax,
    start_date: beginningDatetime,
    subcategories: (parameters?.subcategories ?? [])
      .map((subcategoryLabel) => subcategoryLabelMapping[subcategoryLabel])
      .filter((subcategory): subcategory is SubcategoryIdEnumv2 => subcategory !== undefined),
    isDuo: parameters.isDuo,
    isRecoShuffled: parameters.isRecoShuffled,
    offerTypeList: offertTypeValue,
  }
}

export const useHomeRecommendedOffers = (
  userId: number | undefined,
  position: Position,
  moduleId: string,
  recommendationParameters?: RecommendedOffersModule['recommendationParameters']
): { offers?: Offer[]; recommendationApiParams?: RecommendationApiParams } => {
  const recommendationEndpoint = getRecommendationEndpoint({
    userId,
    position,
    modelEndpoint: recommendationParameters?.modelEndpoint,
  })
  const subcategoryLabelMapping = useSubcategoryLabelMapping()
  const requestParameters = getRecommendationParameters(
    recommendationParameters,
    subcategoryLabelMapping
  )
  const { data: recommendedIdsResponse } = useHomeRecommendedIdsQuery({
    ...requestParameters,
    endpointUrl: recommendationEndpoint,
  })

  return {
    offers: useAlgoliaRecommendedOffers(
      recommendedIdsResponse?.playlist_recommended_offers ?? [],
      moduleId,
      true
    ),
    recommendationApiParams: recommendedIdsResponse?.params,
  }
}
