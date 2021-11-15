import React, { memo, useContext, useEffect, useMemo, useReducer, useState } from 'react'

import { SearchView } from 'features/search/enums'
import { Action, initialSearchState, searchReducer } from 'features/search/pages/reducer'
import { SearchState } from 'features/search/types'
import { useMaxPrice } from 'features/search/utils/useMaxPrice'
import { writeSearchToUrl } from 'features/search/utils/writeSearchStateToUrl'
import { useGeolocation } from 'libs/geolocation'

export interface ISearchContext {
  searchView: SearchView
  setSearchView: (searchView: SearchView, writeToUrl?: boolean) => void
  searchState: SearchState
  dispatch: React.Dispatch<Action>
  stagedSearchState: SearchState
  stagedDispatch: React.Dispatch<Action>
}

export const SearchContext = React.createContext<ISearchContext | null>(null)

export const SearchWrapper = memo(function SearchWrapper({ children }: { children: JSX.Element }) {
  const maxPrice = useMaxPrice()
  const priceRange: [number, number] = [0, maxPrice]
  const initialSearchStateWithPriceRange = { ...initialSearchState, priceRange }

  const [searchView, setSearchView] = useState(SearchView.LANDING)
  const [searchState, dispatch] = useReducer(searchReducer, initialSearchStateWithPriceRange)
  const [stagedSearchState, stagedDispatch] = useReducer(
    searchReducer,
    initialSearchStateWithPriceRange
  )

  const { position } = useGeolocation()

  useEffect(() => {
    const actionType = position ? 'SET_LOCATION_AROUND_ME' : 'SET_LOCATION_EVERYWHERE'
    dispatch({ type: actionType })
    stagedDispatch({ type: actionType })
  }, [!position])

  useEffect(() => {
    dispatch({ type: 'PRICE_RANGE', payload: priceRange })
    stagedDispatch({ type: 'PRICE_RANGE', payload: priceRange })
  }, [maxPrice])

  const contextValue = useMemo(
    () => ({
      searchView,
      setSearchView,
      searchState,
      dispatch,
      stagedSearchState,
      stagedDispatch,
    }),
    [searchView, setSearchView, searchState, stagedSearchState, dispatch, stagedDispatch]
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

export const useSearchView = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { searchView, setSearchView: _setSearchView } = useContext(SearchContext)!
  const setSearchView = (searchView: SearchView) => {
    // For most networks, 20ms is enough time to fetch the results fom Algolia
    // In this case we can avoid displaying the placeholders
    if (searchView === SearchView.RESULTS) {
      globalThis.setTimeout(() => {
        _setSearchView(searchView)
      }, 20)
    } else {
      _setSearchView(searchView)
    }
  }
  return { searchView, setSearchView }
}

type CommitParams = {
  complementSearchState?: Partial<SearchState>
  view?: SearchView
}
const DEFAULT_COMMIT_PARAMS = {
  complementSearchState: undefined,
  view: SearchView.RESULTS,
}

export const useCommitStagedSearch = () => {
  const { searchState: stagedSearchState } = useStagedSearch()
  return {
    commitStagedSearch(params: CommitParams = DEFAULT_COMMIT_PARAMS) {
      const {
        complementSearchState = DEFAULT_COMMIT_PARAMS.complementSearchState,
        view = DEFAULT_COMMIT_PARAMS.view,
      } = params
      let state: SearchState
      if (complementSearchState) {
        state = { ...stagedSearchState, ...complementSearchState }
      } else {
        state = stagedSearchState
      }
      writeSearchToUrl(state, view)
    },
  }
}
