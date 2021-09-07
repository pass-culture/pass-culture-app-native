import { SearchState } from 'features/search/types'

/**
 * See Algolia doc on numericFilters and facetFilters
 *
 * [['A', 'B'], 'C'] <=> (A OR B) AND C
 */
export type FiltersArray = string[][]

export interface SearchParametersQuery extends SearchState {
  page: number
}
