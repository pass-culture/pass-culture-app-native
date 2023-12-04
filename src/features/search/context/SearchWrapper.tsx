import React, { memo, useContext, useEffect, useMemo, useReducer } from 'react'

import { DEFAULT_RADIUS } from 'features/search/constants'
import { Action, initialSearchState, searchReducer } from 'features/search/context/reducer'
import { LocationType } from 'features/search/enums'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { SearchState } from 'features/search/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/geolocation'

interface ISearchContext {
  searchState: SearchState
  dispatch: React.Dispatch<Action>
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
  const { isCustomPosition, place, isGeolocated } = useLocation()

  useEffect(() => {
    if (!enableAppLocation) return
    const { locationType } = searchState.locationFilter
    let aroundRadius = DEFAULT_RADIUS
    const includeDigitalOffers = searchState.includeDigitalOffers ?? false
    if (locationType === LocationType.PLACE || locationType === LocationType.AROUND_ME) {
      aroundRadius = searchState.locationFilter.aroundRadius ?? DEFAULT_RADIUS
    }

    if (searchState.locationFilter.locationType === LocationType.VENUE) {
      return
    } else if (isCustomPosition && place) {
      dispatch({
        type: 'SET_LOCATION_FILTERS',
        payload: {
          locationFilter: {
            place: place,
            locationType: LocationType.PLACE,
            aroundRadius,
          },
          includeDigitalOffers,
        },
      })
    } else if (isGeolocated) {
      dispatch({
        type: 'SET_LOCATION_FILTERS',
        payload: {
          locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius },
          includeDigitalOffers,
        },
      })
    }

    // we don't want to put the searchState in deps (it will create an infinite update loop with the dispatch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCustomPosition, isGeolocated, place, dispatch])

  useEffect(() => {
    dispatch({ type: 'PRICE_RANGE', payload: priceRange })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxPrice])

  const contextValue = useMemo(() => ({ searchState, dispatch }), [searchState, dispatch])

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>
})

// The searchState is initialized so his can't be null
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useSearch = () => useContext(SearchContext)!
