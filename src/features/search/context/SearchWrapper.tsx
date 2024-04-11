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
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { SearchState } from 'features/search/types'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'

interface ISearchContext {
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
  const maxPrice = useMaxPrice()

  const [searchState, dispatch] = useReducer(searchReducer, initialSearchState)
  const { place, selectedLocationMode, aroundMeRadius, aroundPlaceRadius } = useLocation()

  const [isFocusOnSuggestions, setIsFocusOnSuggestions] = useState(false)
  const showSuggestions = useCallback(() => setIsFocusOnSuggestions(true), [])
  const hideSuggestions = useCallback(() => setIsFocusOnSuggestions(false), [])

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

  useEffect(() => {
    // dispatch({ type: 'SET_STATE', payload: { ...searchState, priceRange } })
    dispatch({ type: 'SET_STATE', payload: { ...searchState } })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxPrice])

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

// The searchState is initialized so his can't be null
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useSearch = () => useContext(SearchContext)!
