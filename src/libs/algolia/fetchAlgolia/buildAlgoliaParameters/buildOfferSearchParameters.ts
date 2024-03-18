import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { DisabilitiesProperties } from 'features/accessibility/types'
import { buildFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildFilters'
import {
  buildLocationParameter,
  BuildLocationParameterParams,
} from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { SearchQueryParameters } from 'libs/algolia/types'

import { buildFacetFilters } from './buildFacetFilters'
import { buildNumericFilters } from './buildNumericFilters'

type Parameters = SearchQueryParameters & {
  objectIds?: string[]
  excludedObjectIds?: string[]
  eanList?: string[]
  aroundRadius?: number
}

export const buildOfferSearchParameters = (
  {
    beginningDatetime = undefined,
    date = null,
    eanList = [],
    endingDatetime = undefined,
    excludedObjectIds = [],
    isFullyDigitalOffersCategory = false,
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
      : buildLocationParameter(buildLocationParameterParams)

  return {
    ...buildFacetFilters({
      eanList,
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
    }),
    ...locationParameter,
    ...buildFilters({ excludedObjectIds }),
  }
}
