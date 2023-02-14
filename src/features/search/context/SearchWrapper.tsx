import React, { memo, useContext, useMemo, useReducer } from 'react'

import { Action, initialSearchState, searchReducer } from 'features/search/context/reducer'
import { SearchState } from 'features/search/types'

interface ISearchContext {
  searchState: SearchState
  dispatch: React.Dispatch<Action>
}

const SearchContext = React.createContext<ISearchContext | null>(null)

export const SearchWrapper = memo(function SearchWrapper({ children }: { children: JSX.Element }) {
  const initialSearchStateWithPriceRange = {
    ...initialSearchState,
  }

  const [searchState, dispatch] = useReducer(searchReducer, initialSearchStateWithPriceRange)

  const contextValue = useMemo(() => ({ searchState, dispatch }), [searchState, dispatch])

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>
})

// The searchState is initialized so his can't be null
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useSearch = () => useContext(SearchContext)!
