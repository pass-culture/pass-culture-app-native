import { SearchOptions } from '@elastic/app-search-javascript'

import { SearchParameters } from 'features/search/types'

import { buildFacetFilters } from './buildFacetFilters'
import { buildGeolocationFilter } from './buildGeolocationFilter'
import { buildNumericFilters } from './buildNumericFilters'
import { AppSearchFields, result_fields } from './constants'

export const buildQueryOptions = (params: SearchParameters): SearchOptions<AppSearchFields> => {
  return {
    result_fields,
    filters: {
      all: [
        ...buildFacetFilters(params),
        ...buildNumericFilters(params),
        ...buildGeolocationFilter(params),
      ],
    },
  }
}

export { AppSearchFields }
