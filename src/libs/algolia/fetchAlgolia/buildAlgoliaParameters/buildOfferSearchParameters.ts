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
  enableAppLocation?: boolean
}

export const buildOfferSearchParameters = (
  {
    beginningDatetime = undefined,
    date = null,
    eanList = [],
    endingDatetime = undefined,
    excludedObjectIds = [],
    isFullyDigitalOffersCategory = undefined,
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
    includeDigitalOffers = false,
    venue,
  }: Parameters,
  userLocation: Position,
  isUserUnderage: boolean,
  enableAppLocation?: boolean
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
    includeDigitalOffers,
    isFullyDigitalOffersCategory,
    enableAppLocation,
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
  ...buildGeolocationParameter({
    locationFilter,
    venue,
    userLocation,
    isFullyDigitalOffersCategory,
    enableAppLocation,
  }),
  ...buildFilters({ excludedObjectIds }),
})
