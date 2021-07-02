import { SearchOptions } from '@elastic/app-search-javascript'

import { SearchParameters } from 'features/search/types'

import { buildFacetFilters } from './buildFacetFilters'
import { buildGeolocationFilter } from './buildGeolocationFilter'
import { buildNumericFilters } from './buildNumericFilters'
import { AppSearchFields, RESULT_FIELDS, SORT_OPTIONS } from './constants'

export const buildQueryOptions = (
  params: SearchParameters,
  page?: number
): SearchOptions<AppSearchFields> => ({
  result_fields: RESULT_FIELDS,
  filters: {
    all: [
      ...buildFacetFilters(params),
      ...buildNumericFilters(params),
      ...buildGeolocationFilter(params),
    ],
  },
  page: {
    current: page || 1,
    size: params.hitsPerPage || 20,
  },
  sort: SORT_OPTIONS,
  // TODO(antoinewg): use boosts to sort by proximity. Or use _.sortBy ? pagination ?
  // Although doesn't seem to work for offers without position or negative factor
  // boosts: {
  //   [AppSearchFields.geoloc]: {
  //     type: 'proximity',
  //     function: 'exponential',
  //     center: '48.8557, 2.3469',
  //     factor: 3,
  //   },
  // },
})

export { AppSearchFields, RESULT_FIELDS }
