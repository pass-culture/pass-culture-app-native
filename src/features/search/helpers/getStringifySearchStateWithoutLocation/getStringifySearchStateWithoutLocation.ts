import { SearchState } from 'features/search/types'

export function getStringifySearchStateWithoutLocation(searchState: SearchState) {
  const { locationFilter: _, ...rest } = searchState
  return JSON.stringify(rest)
}
