import { RecommendSearchOptions } from '@algolia/recommend'

import { Coordinates, SearchGroupNameEnumv2 } from 'api/gen'
import { buildOfferCategoriesPredicate } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildFacetFilters'

export const getAlgoliaRecommendParams = (
  position?: Coordinates,
  categories?: SearchGroupNameEnumv2[]
) => {
  let queryParameters: RecommendSearchOptions = {}
  let fallbackParameters: RecommendSearchOptions = {}
  if (position?.latitude && position?.longitude) {
    queryParameters = {
      ...queryParameters,
      aroundLatLng: `${position?.latitude}, ${position?.longitude}`,
      // 100 km
      aroundRadius: 100000,
    }
  }
  if (categories?.length) {
    const categoryFacetFilters = buildOfferCategoriesPredicate(categories)
    queryParameters = {
      ...queryParameters,
      facetFilters: [categoryFacetFilters],
    }
    fallbackParameters = {
      ...fallbackParameters,
      facetFilters: [categoryFacetFilters],
    }
  }

  return { queryParameters, fallbackParameters }
}
