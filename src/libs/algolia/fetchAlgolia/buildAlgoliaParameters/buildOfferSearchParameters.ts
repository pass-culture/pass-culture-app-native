import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { DisabilitiesProperties } from 'features/accessibility/types'
import { buildFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildFilters'
import {
  buildLocationParameterForSearch,
  BuildLocationParameterParams,
} from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildTagFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildTagFilters'
import { SearchQueryParameters } from 'libs/algolia/types'

import { buildFacetFilters } from './buildFacetFilters'
import { buildNumericFilters } from './buildNumericFilters'

type Parameters = SearchQueryParameters & {
  objectIds?: string[]
  excludedObjectIds?: string[]
  aroundRadius?: number
}

export const buildOfferSearchParameters = (
  {
    allocineId = undefined,
    beginningDatetime = undefined,
    date = null,
    eanList = [],
    endingDatetime = undefined,
    excludedObjectIds = [],
    isFullyDigitalOffersCategory = false,
    isHeadline = false,
    maxPossiblePrice = '',
    maxPrice = '',
    minBookingsThreshold = 0,
    minPrice = '',
    objectIds = [],
    offerCategories = [],
    offerGenreTypes = [],
    offerGtlLabel,
    offerGtlLevel,
    offerIsDuo = false,
    offerIsFree = false,
    offerNativeCategories = [],
    offerSubcategories = [],
    isDigital = false,
    priceRange = null,
    tags = [],
    timeRange = null,
    venue,
    gtls = [],
  }: Parameters,
  buildLocationParameterParams: BuildLocationParameterParams,
  isUserUnderage: boolean,
  disabilitiesProperties: DisabilitiesProperties = defaultDisabilitiesProperties
) => {
  const locationParameter =
    venue || isFullyDigitalOffersCategory
      ? {}
      : buildLocationParameterForSearch(buildLocationParameterParams)

  return {
    ...buildFacetFilters({
      eanList,
      allocineId,
      isUserUnderage,
      venue,
      objectIds,
      offerCategories,
      offerGenreTypes,
      offerGtlLabel,
      offerGtlLevel,
      offerIsDuo,
      offerNativeCategories,
      offerSubcategories,
      isDigital,
      tags,
      gtls,
      disabilitiesProperties,
      isHeadline,
    }),
    ...buildNumericFilters({
      beginningDatetime,
      date,
      endingDatetime,
      maxPossiblePrice,
      maxPrice,
      minBookingsThreshold,
      minPrice,
      offerIsFree,
      priceRange,
      timeRange,
      isHeadline,
    }),
    ...locationParameter,
    ...buildFilters({ excludedObjectIds }),
    ...buildTagFilters({}),
  }
}
