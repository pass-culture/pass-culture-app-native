import { GeoCoordinates } from 'react-native-geolocation-service'

import { SearchParameters } from 'features/search/types'

export type AlgoliaGeolocation = Pick<GeoCoordinates, 'longitude' | 'latitude'>

/**
 * See Algolia doc on numericFilters and facetFilters
 *
 * [['A', 'B'], 'C'] <=> (A OR B) AND C
 */
export type FiltersArray = string[][]

export interface SearchParametersQuery extends SearchParameters {
  query: string
  page: number
}
