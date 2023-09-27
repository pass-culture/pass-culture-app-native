import { buildFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildFilters'
import { buildGeolocationParameter } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildGeolocationParameter'
import { SearchQueryParameters } from 'libs/algolia/types'
import { Position } from 'libs/geolocation'

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
    isOnline = undefined,
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
  }: Parameters,
  userLocation: Position,
  isUserUnderage: boolean
) => ({
  ...buildFacetFilters({
    eanList,
    isUserUnderage,
    locationFilter,
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
  ...buildGeolocationParameter({ locationFilter, userLocation, isOnline }),
  ...buildFilters({ excludedObjectIds }),
})
