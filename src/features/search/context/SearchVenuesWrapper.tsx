import React, { memo, useContext, useMemo, useReducer } from 'react'

import {
  initialSearchVenuesState,
  SearchVenuesAction,
  searchVenuesReducer,
} from 'features/search/context/reducer'
import { SearchVenuesState } from 'features/search/types'

interface ISearchVenuesContext {
  searchVenuesState: SearchVenuesState
  dispatch: React.Dispatch<SearchVenuesAction>
}

const SearchVenuesContext = React.createContext<ISearchVenuesContext | null>(null)

export const SearchVenuesWrapper = memo(function SearchVenuesWrapper({
  children,
}: {
  children: React.JSX.Element
}) {
  const [searchVenuesState, dispatch] = useReducer(searchVenuesReducer, initialSearchVenuesState)

  const contextValue = useMemo(
    () => ({ searchVenuesState, dispatch }),
    [searchVenuesState, dispatch]
  )

  return (
    <SearchVenuesContext.Provider value={contextValue}>{children}</SearchVenuesContext.Provider>
  )
})

// The searchState is initialized so his can't be null
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useSearchVenues = () => useContext(SearchVenuesContext)!
