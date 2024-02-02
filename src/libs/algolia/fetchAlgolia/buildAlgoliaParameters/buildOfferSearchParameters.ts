import { buildFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildFilters'
import { deprecatedBuildGeolocationParameter } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { SearchQueryParameters } from 'libs/algolia/types'
import { Position } from 'libs/location'

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
    isDigital = false,
    priceRange = null,
    tags = [],
    timeRange = null,
    venue,
  }: Parameters,
  userLocation: Position,
  isUserUnderage: boolean,
  aroundRadius?: number
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
    isDigital,
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
  ...deprecatedBuildGeolocationParameter({
    locationFilter,
    venue,
    userLocation,
    aroundRadius,
  }),
  ...buildFilters({ excludedObjectIds }),
})
