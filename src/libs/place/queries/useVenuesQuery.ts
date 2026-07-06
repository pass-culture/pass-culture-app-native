import { useQuery } from '@tanstack/react-query'

import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/fetchVenues'
import { LocationMode } from 'libs/location/types'
import {
  useLocationConfiguration,
  useLocationMode,
  useUserLocation,
} from 'libs/locationV2/location.store'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_VENUES = 5 * 60 * 1000

export const useVenuesQuery = (query: string) => {
  const userLocation = useUserLocation()
  const selectedLocationMode = useLocationMode()
  const { radius: aroundMeRadius } = useLocationConfiguration(LocationMode.AROUND_ME)
  const { radius: aroundPlaceRadius } = useLocationConfiguration(LocationMode.AROUND_PLACE)
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
        query,
        buildLocationParameterParams,
      }),
    staleTime: STALE_TIME_VENUES,
    enabled: query.length > 0,
  })
}
