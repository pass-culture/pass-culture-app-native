import { SearchState } from 'features/search/types'
import { buildGeolocationParameter } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildGeolocationParameter'
import { GeoCoordinates } from 'libs/geolocation'

import { buildFacetFilters } from './buildFacetFilters'
import { buildNumericFilters } from './buildNumericFilters'

export const buildOfferSearchParameters = (
  {
    beginningDatetime = null,
    date = null,
    endingDatetime = null,
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
  }: SearchState & { objectIds?: string[] },
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
  }),
  ...buildGeolocationParameter(locationFilter, userLocation),
})
