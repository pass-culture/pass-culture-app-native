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
  stagedSearchState: SearchState
  dispatch: React.Dispatch<Action>
  stagedDispatch: React.Dispatch<Action>
}

export const SearchContext = React.createContext<ISearchContext | null>(null)

export const SearchWrapper = ({ children }: { children: Element }) => {
  const { position } = useGeolocation()
  const [searchState, dispatch] = useReducer(searchReducer, initialSearchState)
  const [stagedSearchState, stagedDispatch] = useReducer(searchReducer, initialSearchState)

  useEffect(() => {
    if (position !== null) {
      const { latitude, longitude } = position
      stagedDispatch({ type: 'LOCATION_AROUND_ME', payload: { latitude, longitude } })
    } else {
      stagedDispatch({ type: 'LOCATION_EVERYWHERE' })
    }
  }, [!position])

  return (
    <SearchContext.Provider value={{ searchState, stagedSearchState, dispatch, stagedDispatch }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = (): Pick<ISearchContext, 'searchState' | 'dispatch'> => {
  // The searchState is initialized so this can't be null
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { searchState, dispatch } = useContext(SearchContext)!
  return { searchState, dispatch }
}

export const useStagedSearch = (): Pick<ISearchContext, 'searchState' | 'dispatch'> => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { stagedSearchState: searchState, stagedDispatch: dispatch } = useContext(SearchContext)!
  return { searchState, dispatch }
}

export const useCommit = (): { commit: () => void } => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { stagedSearchState, dispatch } = useContext(SearchContext)!
  return { commit: () => dispatch({ type: 'SET_STATE', payload: stagedSearchState }) }
}
