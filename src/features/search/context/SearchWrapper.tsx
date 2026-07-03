import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'

import { Action, initialSearchState, searchReducer } from 'features/search/context/reducer'
import { loadSearchFiltersFromUrl } from 'features/search/store/loadSearchFiltersFromUrl'
import { searchStore } from 'features/search/store/search.store'
import { SearchState } from 'features/search/types'
import { useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'

export interface ISearchContext {
  searchState: SearchState
  dispatch: React.Dispatch<Action>
  resetSearch: () => void
  isFocusOnSuggestions: boolean
  showSuggestions: () => void
  hideSuggestions: () => void
}

const SearchContext = React.createContext<ISearchContext | null>(null)

export const SearchWrapper = memo(function SearchWrapper({
  children,
}: {
  children: React.JSX.Element
}) {
  const [searchState, dispatch] = useReducer(searchReducer, initialSearchState)
  const { place, selectedLocationMode, aroundMeRadius, aroundPlaceRadius } = useLocation()

  const [isFocusOnSuggestions, setIsFocusOnSuggestions] = useState(false)
  const showSuggestions = useCallback(() => setIsFocusOnSuggestions(true), [])
  const hideSuggestions = useCallback(() => setIsFocusOnSuggestions(false), [])

  // duplicates the search state in the store to use it outside of the context
  // TODO(PC-42708): use the store directly instead of the context
  useEffect(() => {
    searchStore.actions.setParams(searchState)
  }, [searchState])

  // TODO(PC-42708): move in App.tsx and App.web.tsx
  useEffect(() => {
    void loadSearchFiltersFromUrl(dispatch)
  }, [])

  // TODO(PC-42708): subscribe to location store to observe the changes
  useEffect(() => {
    switch (selectedLocationMode) {
      case LocationMode.AROUND_ME:
        dispatch({
          type: 'SET_LOCATION_AROUND_ME',
          payload: aroundMeRadius,
        })
        break
      case LocationMode.AROUND_PLACE:
        if (place)
          dispatch({
            type: 'SET_LOCATION_PLACE',
            payload: {
              place: place,
              aroundRadius: aroundPlaceRadius,
            },
          })
        break
      case LocationMode.EVERYWHERE:
        dispatch({
          type: 'SET_LOCATION_EVERYWHERE',
        })
        break

      default:
        break
    }
  }, [selectedLocationMode, place, aroundMeRadius, aroundPlaceRadius, dispatch])

  const resetSearch = useCallback(() => {
    dispatch({ type: 'SET_STATE', payload: initialSearchState })
  }, [])

  const contextValue = useMemo(
    () => ({
      searchState,
      dispatch,
      resetSearch,
      isFocusOnSuggestions,
      showSuggestions,
      hideSuggestions,
    }),
    [searchState, dispatch, resetSearch, isFocusOnSuggestions, showSuggestions, hideSuggestions]
  )

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>
})

// The searchState is initialized at null but then can't and won't be
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useSearch = () => useContext(SearchContext)!
