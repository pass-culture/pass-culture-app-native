import { PlaylistRequestBody, RecommendationApiParams, SubcategoryIdEnumv2 } from 'api/gen'
import { buildRecommendationOfferTypesList } from 'features/home/api/helpers/buildRecommendationOfferTypesList'
import { computeBeginningAndEndingDatetimes } from 'features/home/api/helpers/computeBeginningAndEndingDatetimes'
import { RecommendedOffersModule } from 'features/home/types'
import { getCategoriesFacetFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/getCategoriesFacetFilters'
import { Position } from 'libs/location'
import { useHomeRecommendedIdsQuery } from 'libs/recommendation/useHomeRecommendedIdsQuery'
import { useSubcategoryLabelMapping } from 'libs/subcategories/mappings'
import { SubcategoryLabelMapping } from 'libs/subcategories/types'
import { Offer } from 'shared/offer/types'

import { useAlgoliaRecommendedOffers } from './useAlgoliaRecommendedOffers'

export function getRecommendationParameters(
  parameters: RecommendedOffersModule['recommendationParameters'] | undefined,
  subcategoryLabelMapping: SubcategoryLabelMapping
): PlaylistRequestBody {
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
    endDate: endingDatetime,
    isEvent: parameters?.isEvent,
    priceMin: parameters?.priceMin,
    priceMax: parameters?.priceMax,
    startDate: beginningDatetime,
    subcategories: (parameters?.subcategories ?? [])
      .map((subcategoryLabel) => subcategoryLabelMapping[subcategoryLabel])
      .filter((subcategory): subcategory is SubcategoryIdEnumv2 => subcategory !== undefined),
    isDuo: parameters.isDuo,
    isRecoShuffled: parameters.isRecoShuffled,
    offerTypeList: offertTypeValue,
  }
}

export const useHomeRecommendedOffers = (
  position: Position,
  moduleId: string,
  recommendationParameters?: RecommendedOffersModule['recommendationParameters'],
  userId?: number
): { offers?: Offer[]; recommendationApiParams?: RecommendationApiParams } => {
  const subcategoryLabelMapping = useSubcategoryLabelMapping()
  const requestParameters = getRecommendationParameters(
    recommendationParameters,
    subcategoryLabelMapping
  )
  const { data } = useHomeRecommendedIdsQuery({
    playlistRequestBody: requestParameters,
    playlistRequestQuery: {
      latitude: position?.latitude,
      longitude: position?.longitude,
      modelEndpoint: recommendationParameters?.modelEndpoint,
    },
    userId,
  })

  return {
    offers: useAlgoliaRecommendedOffers(data?.playlistRecommendedOffers ?? [], moduleId, true),
    recommendationApiParams: data?.params,
  }
}
