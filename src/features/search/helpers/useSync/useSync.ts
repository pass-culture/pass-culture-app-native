import { useNavigation, useRoute } from '@react-navigation/native'
import { isEqual } from 'lodash'
import { useEffect, useRef, useState } from 'react'

import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { SearchState } from 'features/search/types'
import { useLocation } from 'libs/location/LocationWrapper'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'

/**
 * Synchronizes URL parameters with application state.
 *
 * Flow (to avoid race conditions):
 *
 * 1. Sync URL params → State (one-time, on mount)
 * 2. Sync State → URL params (when state changes)
 */
export const useSync = (shouldSync = true) => {
  const urlParamsToSync = useRef<Record<string, unknown> | null>(null)
  const [canSwitchToAroundMe, setCanSwitchToAroundMe] = useState(false)

  const { params } = useRoute<UseRouteType<'SearchResults' | 'SearchFilter'>>()
  const { setParams } = useNavigation<UseNavigationType>()
  const { searchState, dispatch } = useSearch()
  const { disabilities, setDisabilities } = useAccessibilityFiltersContext()
  const {
    setPlace,
    setSelectedLocationMode,
    setSelectedPlace,
    setAroundMeRadius,
    hasGeolocPosition,
  } = useLocation()

  /*
   * 1) URL => State (one-time, on mount)
   */
  useEffect(() => {
    if (!shouldSync || urlParamsToSync.current !== null) return

    const { accessibilityFilter, ...searchParamsFromUrl } = params ?? {}

    urlParamsToSync.current = searchParamsFromUrl

    const hasSearchParams = Object.keys(searchParamsFromUrl).length > 0
    if (hasSearchParams) {
      dispatch({
        type: 'SET_STATE',
        payload: { ...searchState, ...searchParamsFromUrl } as SearchState,
      })
    }

    if (accessibilityFilter) {
      setDisabilities((current) => ({ ...current, ...accessibilityFilter }))
    }

    const locationFilter = searchParamsFromUrl.locationFilter
    if (locationFilter) {
      syncLocationFromParams(locationFilter, {
        setPlace,
        setSelectedPlace,
        setSelectedLocationMode,
        setCanSwitchToAroundMe,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /*
   * 2) State => URL (when state changes)
   */
  useEffect(() => {
    if (!shouldSync) return

    if (urlParamsToSync.current === null) return

    // Avoids infinite loop when the state is initially set to the default value (for example when we go back)
    const isInitialState = Object.keys(initialSearchState).every((key) => {
      const currentValue = searchState[key as keyof SearchState]
      const initialValue = initialSearchState[key as keyof SearchState]
      return isEqual(currentValue, initialValue)
    })
    if (isInitialState) return

    const pendingParams = urlParamsToSync.current
    const stateHasUrlParams = Object.keys(pendingParams).every((key) => {
      const urlValue = pendingParams[key]
      const stateValue = searchState[key as keyof SearchState]

      if (urlValue === undefined || urlValue === null) return true
      if (Array.isArray(urlValue) && urlValue.length === 0) return true
      return isEqual(stateValue, urlValue)
    })

    if (!stateHasUrlParams) {
      return
    }
    urlParamsToSync.current = {}

    const newParams = {
      ...searchState,
      accessibilityFilter: disabilities,
    }

    if (!isEqual(params, newParams)) {
      setParams(newParams)
    }
  }, [shouldSync, searchState, disabilities, params, setParams])

  // Handle AROUND_ME (requires geoloc permission, runs only once)
  useEffect(() => {
    if (!canSwitchToAroundMe || !hasGeolocPosition) return

    setSelectedLocationMode(LocationMode.AROUND_ME)
    setCanSwitchToAroundMe(false)

    if (
      params?.locationFilter?.locationType === LocationMode.AROUND_ME &&
      params?.locationFilter?.aroundRadius
    ) {
      setAroundMeRadius(params.locationFilter.aroundRadius)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasGeolocPosition,
    canSwitchToAroundMe,
    setSelectedLocationMode,
    setAroundMeRadius,
    params?.locationFilter?.locationType,
  ])
}

function syncLocationFromParams(
  locationFilter: SearchState['locationFilter'],
  handlers: {
    setPlace: (place: SuggestedPlace | null) => void
    setSelectedPlace: (place: SuggestedPlace | null) => void
    setSelectedLocationMode: (mode: LocationMode) => void
    setCanSwitchToAroundMe: (value: boolean) => void
  }
) {
  switch (locationFilter.locationType) {
    case LocationMode.AROUND_PLACE:
      handlers.setPlace(locationFilter.place)
      handlers.setSelectedPlace(locationFilter.place)
      handlers.setSelectedLocationMode(LocationMode.AROUND_PLACE)
      break
    case LocationMode.EVERYWHERE:
      handlers.setSelectedLocationMode(LocationMode.EVERYWHERE)
      break
    case LocationMode.AROUND_ME:
      // Flag to trigger AROUND_ME once geoloc is available
      handlers.setCanSwitchToAroundMe(true)
      break
  }
}
