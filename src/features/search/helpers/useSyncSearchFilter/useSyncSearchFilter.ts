import { useNavigation, useNavigationState, useRoute } from '@react-navigation/native'
import isEqual from 'lodash/isEqual'
import { useEffect, useState } from 'react'

import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'

export const useSyncSearchFilter = () => {
  const [isLocked, setIsLocked] = useState(false) // we use a locker to avoid glitches caused by params and state changed simultaneously
  const [canSwitchToAroundMe, setCanSwitchToAroundMe] = useState(false) // we use this flag to authorize the switch to AROUND_ME mode when location type in params is AROUND_ME

  const { params } = useRoute<UseRouteType<'SearchFilter'>>()
  const { setParams } = useNavigation<UseNavigationType>()
  const { dispatch, searchState } = useSearch()
  const routes = useNavigationState((state) => state.routes)
  const currentRoute = routes[routes.length - 1].name
  const { setPlace, setSelectedLocationMode, hasGeolocPosition } = useLocation()

  useEffect(() => {
    if (canSwitchToAroundMe && hasGeolocPosition) {
      setSelectedLocationMode(LocationMode.AROUND_ME)
      setCanSwitchToAroundMe(false)
    }
  }, [hasGeolocPosition, canSwitchToAroundMe, setSelectedLocationMode])

  useEffect(() => {
    if (!isLocked && !!params && !isEqual(params, searchState)) {
      dispatch({
        type: 'SET_STATE',
        payload: { ...initialSearchState, ...params },
      })

      switch (params.locationFilter?.locationType) {
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
        default:
          break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  useEffect(() => {
    setIsLocked(true)

    if (currentRoute === 'SearchFilter') setParams(searchState)

    const timer = setTimeout(() => setIsLocked(false), 0)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState])
}
