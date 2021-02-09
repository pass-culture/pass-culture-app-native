import React, { useContext, useEffect, useReducer } from 'react'

import {
  Action,
  initialSearchState,
  searchReducer,
  SearchState,
} from 'features/search/pages/reducer'
import { useGeolocation } from 'libs/geolocation'

export interface ISearchContext {
  searchState: SearchState
  dispatch: React.Dispatch<Action>
}

export const SearchContext = React.createContext<ISearchContext | null>(null)

export const SearchWrapper = ({ children }: { children: Element }) => {
  const { position } = useGeolocation()
  const [searchState, dispatch] = useReducer(searchReducer, initialSearchState)

  useEffect(() => {
    if (position !== null) {
      const { latitude, longitude } = position
      dispatch({ type: 'LOCATION_AROUND_ME', payload: { latitude, longitude } })
    }
  }, [!position])

  return (
    <SearchContext.Provider value={{ searchState, dispatch }}>{children}</SearchContext.Provider>
  )
}

export const useSearch = (): ISearchContext => {
  const searchContext = useContext(SearchContext)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return searchContext! // The searchState is initialized so this can't be null
}
