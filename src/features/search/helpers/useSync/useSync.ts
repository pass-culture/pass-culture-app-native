import { useNavigation, useRoute } from '@react-navigation/native'
import isEqual from 'lodash/isEqual'
import { useEffect, useState } from 'react'

import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { DisabilitiesProperties } from 'features/accessibility/types'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useLocation } from 'libs/location/LocationWrapper'
import { LocationMode } from 'libs/location/types'

export const useSync = (shouldUpdate = true) => {
  const [isLocked, setIsLocked] = useState(false) // we use a locker to avoid glitches caused by params and state changed simultaneously
  const [canSwitchToAroundMe, setCanSwitchToAroundMe] = useState(false) // we use this flag to authorize the switch to AROUND_ME mode when location type in params is AROUND_ME

  const { params } = useRoute<UseRouteType<'SearchLanding' | 'SearchResults' | 'SearchFilter'>>()
  const { accessibilityFilter, ...searchStateParams } = params || {}
  const disabilitiesParams: Partial<DisabilitiesProperties> = accessibilityFilter || {}
  const { setParams } = useNavigation<UseNavigationType>()
  const { searchState, dispatch } = useSearch()
  const { setPlace, setSelectedLocationMode, hasGeolocPosition, setSelectedPlace } = useLocation()
  const { disabilities, setDisabilities } = useAccessibilityFiltersContext()

  useEffect(() => {
    if (canSwitchToAroundMe && hasGeolocPosition) {
      setSelectedLocationMode(LocationMode.AROUND_ME)
      setCanSwitchToAroundMe(false)
    }
  }, [hasGeolocPosition, canSwitchToAroundMe, setSelectedLocationMode])

  // update params -> accessibilityContext
  useEffect(() => {
    if (isLocked || !shouldUpdate) return
    if (!!accessibilityFilter && !isEqual(accessibilityFilter, disabilities)) {
      setDisabilities({ ...disabilities, ...disabilitiesParams })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessibilityFilter, disabilitiesParams, isLocked, setDisabilities])

  // update params -> SearchState
  useEffect(() => {
    if (isLocked || !shouldUpdate) return
    if (!!params && !isEqual(searchStateParams, searchState)) {
      dispatch({
        type: 'SET_STATE',
        payload: { ...searchState, ...searchStateParams },
      })

      switch (params.locationFilter?.locationType) {
        case undefined: {
          break
        }
        case LocationMode.AROUND_ME: {
          setCanSwitchToAroundMe(true)
          break
        }
        case LocationMode.AROUND_PLACE: {
          setPlace(params.locationFilter.place)
          setSelectedPlace(params.locationFilter.place)
          setSelectedLocationMode(LocationMode.AROUND_PLACE)
          break
        }
        case LocationMode.EVERYWHERE: {
          setSelectedLocationMode(LocationMode.EVERYWHERE)
          break
        }
      }
    }

    // we don't want isLocked in the dependencies, because it should only be triggered by params updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDisabilities, dispatch, params, setPlace, setSelectedLocationMode])

  useEffect(() => {
    setIsLocked(true)
    const disabilityAndSearchContext = { ...searchState, accessibilityFilter: disabilities }
    if (!isEqual(params, disabilityAndSearchContext) && shouldUpdate) {
      setParams(disabilityAndSearchContext)
    }
    const timer = setTimeout(() => setIsLocked(false), 0)
    return () => clearTimeout(timer)
    // we don't want shouldUpdate in the dependencies, because it should only be triggered by SearchState updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState, disabilities, setParams])
}
