import { useQuery } from '@tanstack/react-query'

import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/fetchVenues'
import { useLocation } from 'libs/location/location'
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

  return useQuery({
    queryKey: [QueryKeys.VENUES, query, buildLocationParameterParams],
    queryFn: () =>
      fetchVenues({
        query: query,
        buildLocationParameterParams,
      }),
    staleTime: STALE_TIME_VENUES,
    enabled: query.length > 0,
  })
}
