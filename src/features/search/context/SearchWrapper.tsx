import React, { memo, useContext, useEffect, useMemo, useReducer } from 'react'

import { DEFAULT_RADIUS } from 'features/location/components/SearchLocationModal'
import { Action, initialSearchState, searchReducer } from 'features/search/context/reducer'
import { LocationType } from 'features/search/enums'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { SearchState } from 'features/search/types'
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
  const maxPrice = useMaxPrice()
  const priceRange: [number, number] = [0, maxPrice]

  const initialSearchStateWithPriceRange = {
    ...initialSearchState,
    priceRange,
  }

  const [searchState, dispatch] = useReducer(searchReducer, initialSearchStateWithPriceRange)
  const { isCustomPosition, place, isGeolocated } = useLocation()

  useEffect(() => {
    const { locationType } = searchState.locationFilter
    let aroundRadius = DEFAULT_RADIUS
    if (locationType === LocationType.PLACE || locationType === LocationType.AROUND_ME) {
      aroundRadius = searchState.locationFilter.aroundRadius ?? DEFAULT_RADIUS
    }

    if (isCustomPosition && place) {
      dispatch({
        type: 'SET_LOCATION_FILTERS',
        payload: {
          locationFilter: {
            place: place,
            locationType: LocationType.PLACE,
            aroundRadius,
          },
          includeDigitalOffers: false,
        },
      })
    } else if (isGeolocated) {
      dispatch({
        type: 'SET_LOCATION_FILTERS',
        payload: {
          locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius },
          includeDigitalOffers: false,
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
