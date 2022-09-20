import { useNavigation } from '@react-navigation/native'
import React, { memo, useContext, useEffect, useMemo, useReducer } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { Action, initialSearchState, searchReducer } from 'features/search/pages/reducer'
import { SearchState } from 'features/search/types'
import { useMaxPrice } from 'features/search/utils/useMaxPrice'
import { useGeolocation } from 'libs/geolocation'

interface ISearchContext {
  searchState: SearchState
  stagedSearchState: SearchState
  dispatch: React.Dispatch<Action>
  stagedDispatch: React.Dispatch<Action>
}

const SearchContext = React.createContext<ISearchContext | null>(null)

export const SearchWrapper = memo(function SearchWrapper({ children }: { children: JSX.Element }) {
  const { position } = useGeolocation()

  const maxPrice = useMaxPrice()
  const priceRange: [number, number] = [0, maxPrice]

  const initialSearchStateWithPriceRange = {
    ...initialSearchState,
    priceRange,
  }

  const [searchState, dispatch] = useReducer(searchReducer, initialSearchStateWithPriceRange)
  const [stagedSearchState, stagedDispatch] = useReducer(
    searchReducer,
    initialSearchStateWithPriceRange
  )

  useEffect(() => {
    const actionType = position ? 'SET_LOCATION_AROUND_ME' : 'SET_LOCATION_EVERYWHERE'
    dispatch({ type: actionType })
    stagedDispatch({ type: actionType })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!position])

  useEffect(() => {
    dispatch({ type: 'PRICE_RANGE', payload: priceRange })
    stagedDispatch({ type: 'PRICE_RANGE', payload: priceRange })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxPrice])

  const contextValue = useMemo(
    () => ({ searchState, stagedSearchState, dispatch, stagedDispatch }),
    [searchState, stagedSearchState, dispatch, stagedDispatch]
  )

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>
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
  const { searchState: stagedSearchState } = useStagedSearch()

  return {
    commit() {
      navigate(...getTabNavConfig('Search', stagedSearchState))
    },
  }
}
