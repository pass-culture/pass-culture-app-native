import { useNavigation } from '@react-navigation/native'
import React, { memo, useContext, useEffect, useReducer } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { Action, initialSearchState, searchReducer } from 'features/search/pages/reducer'
import { SearchState } from 'features/search/types'
import { useGeolocation } from 'libs/geolocation'

export interface ISearchContext {
  searchState: SearchState
  stagedSearchState: SearchState
  dispatch: React.Dispatch<Action>
  stagedDispatch: React.Dispatch<Action>
}

export const SearchContext = React.createContext<ISearchContext | null>(null)

export const SearchWrapper = memo(function SearchWrapper({ children }: { children: JSX.Element }) {
  const { position } = useGeolocation()
  const [searchState, dispatch] = useReducer(searchReducer, initialSearchState)
  const [stagedSearchState, stagedDispatch] = useReducer(searchReducer, initialSearchState)

  useEffect(() => {
    const actionType = position ? 'SET_LOCATION_AROUND_ME' : 'SET_LOCATION_EVERYWHERE'
    dispatch({ type: actionType })
    stagedDispatch({ type: actionType })
  }, [!position])

  return (
    <SearchContext.Provider value={{ searchState, stagedSearchState, dispatch, stagedDispatch }}>
      {children}
    </SearchContext.Provider>
  )
})

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
  const { navigate } = useNavigation<UseNavigationType>()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { stagedSearchState } = useContext(SearchContext)!
  return {
    commit() {
      navigate('TabNavigator', {
        screen: 'Search',
        params: stagedSearchState,
<<<<<<< HEAD
      } as never)
=======
      })
>>>>>>> 7372c53d ([PC-10406] [FIX] Add correct navigation on filter search result button by using nesting-navigation method of react-navigation)
    },
  }
}
