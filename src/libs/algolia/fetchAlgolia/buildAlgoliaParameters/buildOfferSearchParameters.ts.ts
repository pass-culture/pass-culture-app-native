import { SearchState } from 'features/search/types'
import { buildFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildFilters'
import { buildGeolocationParameter } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildGeolocationParameter'
import { GeoCoordinates } from 'libs/geolocation'

import { buildFacetFilters } from './buildFacetFilters'
import { buildNumericFilters } from './buildNumericFilters'

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
  }: SearchState & { objectIds?: string[]; excludedObjectIds?: string[] },
  userLocation: GeoCoordinates | null,
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
  ...buildGeolocationParameter(locationFilter, userLocation, isOnline),
  ...buildFilters({ excludedObjectIds }),
})
