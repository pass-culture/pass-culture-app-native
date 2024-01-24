import { useNavigation, useRoute } from '@react-navigation/native'
import isEqual from 'lodash/isEqual'
import { useEffect, useState } from 'react'

import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useLocation } from 'libs/location/LocationWrapper'
import { LocationMode } from 'libs/location/types'

export const useSync = (shouldUpdate?: boolean) => {
  const [isLocked, setIsLocked] = useState(false) // we use a locker to avoid glitches caused by params and state changed simultaneously
  const [canSwitchToAroundMe, setCanSwitchToAroundMe] = useState(false) // we use this flag to authorize the switch to AROUND_ME mode when location type in params is AROUND_ME

  const { params } = useRoute<UseRouteType<'Search' | 'SearchFilter'>>()
  const { setParams } = useNavigation<UseNavigationType>()
  const { searchState, dispatch } = useSearch()
  const { setPlace, setSelectedLocationMode, hasGeolocPosition } = useLocation()

  useEffect(() => {
    if (canSwitchToAroundMe && hasGeolocPosition) {
      setSelectedLocationMode(LocationMode.AROUND_ME)
      setCanSwitchToAroundMe(false)
    }
  }, [hasGeolocPosition, canSwitchToAroundMe, setSelectedLocationMode])

  // update params -> SearchState
  useEffect(() => {
    if (!isLocked && !!params && !isEqual(params, searchState)) {
      dispatch({
        type: 'SET_STATE',
        payload: { ...initialSearchState, ...params },
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
  }, [dispatch, params, setPlace, setSelectedLocationMode])

  //update searchState -> params
  useEffect(() => {
    setIsLocked(true)

    if (!isEqual(params, searchState || shouldUpdate)) {
      setParams(searchState)
    }

    const timer = setTimeout(() => setIsLocked(false), 0)
    return () => clearTimeout(timer)
    // we don't want shouldUpdate in the dependencies, because it should only be triggered by SearchState updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState, setParams])
}
