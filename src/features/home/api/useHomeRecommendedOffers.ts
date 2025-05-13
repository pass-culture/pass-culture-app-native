import { useIsFocused } from '@react-navigation/native'

import { PlaylistRequestBody, RecommendationApiParams, SubcategoryIdEnumv2 } from 'api/gen'
import { buildRecommendationOfferTypesList } from 'features/home/api/helpers/buildRecommendationOfferTypesList'
import { computeBeginningAndEndingDatetimes } from 'features/home/api/helpers/computeBeginningAndEndingDatetimes'
import { RecommendedOffersModule } from 'features/home/types'
import { useSubcategoryIdsFromSearchGroups } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { getCategoriesFacetFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/getCategoriesFacetFilters'
import { Position } from 'libs/location'
import { QueryKeys } from 'libs/queryKeys'
import { useHomeRecommendedIdsQuery } from 'libs/recommendation/useHomeRecommendedIdsQuery'
import { useSubcategoryLabelMapping } from 'libs/subcategories/mappings'
import { useAlgoliaSimilarOffersQuery } from 'queries/offer/useAlgoliaSimilarOffersQuery'
import { Offer } from 'shared/offer/types'

export function getRecommendationParameters(
  parameters: RecommendedOffersModule['recommendationParameters'] | undefined,
  subcategories: SubcategoryIdEnumv2[]
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
    endDate: endingDatetime,
    isEvent: parameters?.isEvent,
    priceMin: parameters?.priceMin,
    priceMax: parameters?.priceMax,
    startDate: beginningDatetime,
    subcategories,
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
): { offers: Offer[]; recommendationApiParams?: RecommendationApiParams } => {
  const subcategoryLabelMapping = useSubcategoryLabelMapping()
  const isFocused = useIsFocused()

  const categoriesFromContentful = (recommendationParameters?.categories ?? []).map(
    getCategoriesFacetFilters
  )

  const subcategoriesFromContentful = (recommendationParameters?.subcategories ?? [])
    .map((subcategoryLabel) => subcategoryLabelMapping[subcategoryLabel])
    .filter((subcategory): subcategory is SubcategoryIdEnumv2 => subcategory !== undefined)

  const subcategoriesRelatedToSearchGroups =
    useSubcategoryIdsFromSearchGroups(categoriesFromContentful)

  const subcategories = Array.from(
    new Set([...subcategoriesFromContentful, ...subcategoriesRelatedToSearchGroups])
  )

  const requestParameters = getRecommendationParameters(recommendationParameters, subcategories)

  const { data } = useHomeRecommendedIdsQuery({
    playlistRequestBody: requestParameters,
    playlistRequestQuery: {
      latitude: position?.latitude,
      longitude: position?.longitude,
      modelEndpoint: recommendationParameters?.modelEndpoint,
    },
    shouldFetch: isFocused,
    userId,
  })

  const ids = data?.playlistRecommendedOffers ?? []
  return {
    offers:
      useAlgoliaSimilarOffersQuery(ids, true, [QueryKeys.RECOMMENDATION_HITS, moduleId, ids]) || [],
    recommendationApiParams: data?.params,
  }
}
