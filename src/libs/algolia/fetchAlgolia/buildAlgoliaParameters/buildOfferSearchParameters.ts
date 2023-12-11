import { buildFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildFilters'
import { SearchQueryParameters } from 'libs/algolia/types'

import { buildFacetFilters } from './buildFacetFilters'
import { buildNumericFilters } from './buildNumericFilters'

type Parameters = SearchQueryParameters & {
  objectIds?: string[]
  excludedObjectIds?: string[]
  eanList?: string[]
}

export const buildOfferSearchParameters = (
  {
    beginningDatetime = undefined,
    date = null,
    eanList = [],
    endingDatetime = undefined,
    excludedObjectIds = [],
    locationFilter,
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
    offerIsNew = false,
    offerNativeCategories = [],
    offerSubcategories = [],
    offerTypes = {
      isDigital: false,
      isEvent: false,
      isThing: false,
    },
    priceRange = null,
    tags = [],
    timeRange = null,
    venue,
  }: Parameters,
  isUserUnderage: boolean
) => ({
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
    offerTypes,
    tags,
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
    offerIsNew,
    priceRange,
    timeRange,
  }),
  locationFilter,
  ...buildFilters({ excludedObjectIds }),
})
