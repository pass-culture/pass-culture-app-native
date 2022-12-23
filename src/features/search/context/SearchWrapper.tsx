import React, { memo, useContext, useEffect, useMemo, useReducer } from 'react'

import { Action, initialSearchState, searchReducer } from 'features/search/context/reducer'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { SearchState } from 'features/search/types'

interface ISearchContext {
  searchState: SearchState
  dispatch: React.Dispatch<Action>
}

const SearchContext = React.createContext<ISearchContext | null>(null)

export const SearchWrapper = memo(function SearchWrapper({ children }: { children: JSX.Element }) {
  const maxPrice = useMaxPrice()
  const priceRange: [number, number] = [0, maxPrice]

  const initialSearchStateWithPriceRange = {
    ...initialSearchState,
    priceRange,
  }

  const [searchState, dispatch] = useReducer(searchReducer, initialSearchStateWithPriceRange)

  useEffect(() => {
    dispatch({ type: 'PRICE_RANGE', payload: priceRange })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxPrice])

  const contextValue = useMemo(() => ({ searchState, dispatch }), [searchState, dispatch])

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>
})

export const useSearch = () => {
  // The searchState is initialized so this can't be null
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { searchState, dispatch } = useContext(SearchContext)!
  return { searchState, dispatch }
}
