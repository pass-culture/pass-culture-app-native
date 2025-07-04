import { useQuery } from '@tanstack/react-query'

import { Venue } from 'features/venue/types'
import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/fetchVenues'
import { useLocation } from 'libs/location'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_VENUES = 5 * 60 * 1000

export const useVenues = (query: string) => {
  const { userLocation, selectedLocationMode, aroundMeRadius, aroundPlaceRadius } = useLocation()
  const buildLocationParameterParams = {
    userLocation,
    selectedLocationMode,
    aroundMeRadius,
    aroundPlaceRadius,
  }

  return useQuery<Venue[]>(
    [QueryKeys.VENUES, query, buildLocationParameterParams],
    () =>
      fetchVenues({
        query: query,
        buildLocationParameterParams,
      }),
    {
      staleTime: STALE_TIME_VENUES,
      enabled: query.length > 0,
    }
  )
}
