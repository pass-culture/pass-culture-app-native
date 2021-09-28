import { SearchOptions } from '@elastic/app-search-javascript'

import { SearchGroupNameEnum } from 'api/gen'
import { PartialSearchState } from 'features/search/types'
import { GeoCoordinates } from 'libs/geolocation'
import { buildBoosts } from 'libs/search/filters/buildBoosts'

import { buildFacetFilters } from './buildFacetFilters'
import { buildGeolocationFilter } from './buildGeolocationFilter'
import { buildNumericFilters } from './buildNumericFilters'
import { AppSearchFields, FALSE, RESULT_FIELDS, SORT_OPTIONS } from './constants'

// we don't want to show offers to underage users if those offers are digital, not free and not in press category.
// As a result if an offer is either not digital, free, or is in category press, we can show it to the underage users.
export const underageFilter = {
  any: [
    { [AppSearchFields.is_digital]: FALSE },
    { [AppSearchFields.prices]: { to: 1 } },
    { [AppSearchFields.search_group_name]: SearchGroupNameEnum.PRESSE },
  ],
}

export const buildQueryOptions = (
  searchState: PartialSearchState,
  userLocation: GeoCoordinates | null,
  isUserUnderage: boolean,
  page?: number
): SearchOptions<AppSearchFields> => {
  const queryOptions: SearchOptions<AppSearchFields> = {
    result_fields: RESULT_FIELDS,
    filters: {
      all: [
        ...buildFacetFilters(searchState),
        ...buildNumericFilters(searchState),
        ...buildGeolocationFilter(searchState.locationFilter, userLocation),
      ],
      ...(isUserUnderage && underageFilter),
    },
    page: {
      current: page || 1,
      size: searchState.hitsPerPage || 20,
    },
    group: {
      // This ensures that only one offer of each group is retrieved.
      // Ex: when we look for a book, we only show one per isbn (one per visa for the movies).
      // See https://www.elastic.co/fr/blog/advanced-search-queries-in-elastic-app-search
      field: AppSearchFields.group,
    },
    sort: SORT_OPTIONS,
  }

  const boosts = buildBoosts(userLocation, searchState.locationFilter)
  if (boosts) {
    queryOptions['boosts'] = boosts
  }

  return queryOptions
}

export { AppSearchFields, RESULT_FIELDS }
