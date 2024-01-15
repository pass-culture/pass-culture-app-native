import { useNavigation, useRoute } from '@react-navigation/native'
import isEqual from 'lodash/isEqual'
import { useEffect, useState } from 'react'

import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { LocationMode } from 'libs/algolia'
import { useLocation } from 'libs/location'

export const useSyncSearch = () => {
  const [isLocked, setIsLocked] = useState(false) // we use a locker to avoid glitches caused by params and state changed simultaneously
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { setParams } = useNavigation<UseNavigationType>()
  const { dispatch, searchState } = useSearch()
  const { setPlace, setSelectedLocationMode } = useLocation()

  useEffect(() => {
    if (!isLocked && !!params && !isEqual(params, searchState)) {
      dispatch({
        type: 'SET_STATE',
        payload: { ...initialSearchState, ...params },
      })

      if (params.locationFilter?.locationType === LocationMode.AROUND_PLACE) {
        setPlace(params.locationFilter.place)
        setSelectedLocationMode(LocationMode.AROUND_PLACE)
      }
      if (params?.locationFilter?.locationType === LocationMode.EVERYWHERE) {
        setSelectedLocationMode(LocationMode.EVERYWHERE)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  useEffect(() => {
    setIsLocked(true)

    if (!isEqual(params, searchState)) {
      setParams(searchState)
    }

    const timer = setTimeout(() => setIsLocked(false), 0)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState])
}
