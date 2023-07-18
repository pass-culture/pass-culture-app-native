import { LocationType } from 'features/search/enums'
import { buildFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildFilters'
import { buildGeolocationParameter } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildGeolocationParameter'
import { SearchQueryParameters } from 'libs/algolia/types'
import { Position } from 'libs/geolocation'

import { buildFacetFilters } from './buildFacetFilters'
import { buildNumericFilters } from './buildNumericFilters'

type Parameters = SearchQueryParameters & {
  objectIds?: string[]
  excludedObjectIds?: string[]
}

export const buildOfferSearchParameters = (
  {
    beginningDatetime = undefined,
    date = null,
    endingDatetime = undefined,
    locationFilter,
    offerCategories = [],
    offerNativeCategories = [],
    offerGenreTypes = [],
    offerSubcategories = [],
    objectIds = [],
    offerIsDuo = false,
    offerIsFree = false,
    offerIsNew = false,
    offerTypes = {
      isDigital: false,
      isEvent: false,
      isThing: false,
    },
    priceRange = null,
    timeRange = null,
    tags = [],
    minPrice = '',
    maxPrice = '',
    excludedObjectIds = [],
    maxPossiblePrice = '',
    isOnline = undefined,
    minBookingsThreshold = 0,
  }: Parameters,
  userLocation: Position,
  isUserUnderage: boolean
) => ({
  ...buildFacetFilters({
    isUserUnderage,
    locationFilter,
    objectIds,
    offerCategories,
    offerGenreTypes,
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
    offerIsFree,
    offerIsNew,
    priceRange,
    timeRange,
    minPrice,
    maxPrice,
    maxPossiblePrice,
    minBookingsThreshold,
  }),
  ...buildGeolocationParameter(
    locationFilter ?? { locationType: LocationType.EVERYWHERE },
    userLocation,
    isOnline
  ),
  ...buildFilters({ excludedObjectIds }),
})
