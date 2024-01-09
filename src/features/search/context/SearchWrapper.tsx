import React, { memo, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'

import { Action, initialSearchState, searchReducer } from 'features/search/context/reducer'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { SearchState } from 'features/search/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'

interface ISearchContext {
  searchState: SearchState
  dispatch: React.Dispatch<Action>
  resetSearch: () => void
}

const SearchContext = React.createContext<ISearchContext | null>(null)

export const SearchWrapper = memo(function SearchWrapper({
  children,
}: {
  children: React.JSX.Element
}) {
  const enableAppLocation = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_APP_LOCATION)
  const maxPrice = useMaxPrice()
  const priceRange: [number, number] = [0, maxPrice]

  const initialSearchStateWithPriceRange = {
    ...initialSearchState,
    priceRange,
  }

  const [searchState, dispatch] = useReducer(searchReducer, initialSearchStateWithPriceRange)
  const { place, selectedLocationMode, aroundMeRadius, aroundPlaceRadius } = useLocation()

  useEffect(() => {
    if (!enableAppLocation) return

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
  }, [selectedLocationMode, place, aroundMeRadius, aroundPlaceRadius, dispatch, enableAppLocation])

  useEffect(() => {
    dispatch({ type: 'PRICE_RANGE', payload: priceRange })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxPrice])

  const resetSearch = useCallback(() => {
    dispatch({ type: 'SET_STATE', payload: initialSearchState })
  }, [])

  const contextValue = useMemo(
    () => ({ searchState, dispatch, resetSearch }),
    [searchState, dispatch, resetSearch]
  )

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>
})

// The searchState is initialized so his can't be null
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useSearch = () => useContext(SearchContext)!
