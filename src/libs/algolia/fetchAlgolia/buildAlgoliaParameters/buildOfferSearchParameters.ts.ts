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
  }: SearchState & { objectIds?: string[]; excludedObjectIds?: string[] },
  userLocation: GeoCoordinates | null,
  isUserUnderage: boolean
) => ({
  ...buildFacetFilters({
    locationFilter,
    offerCategories,
    offerSubcategories,
    objectIds,
    offerTypes,
    offerIsDuo,
    tags,
    isUserUnderage,
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
  }),
  ...buildGeolocationParameter(locationFilter, userLocation),
  ...buildFilters({ excludedObjectIds }),
})
