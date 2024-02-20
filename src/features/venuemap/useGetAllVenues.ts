import { useQuery } from 'react-query'

import { Venue } from 'features/venue/types'
import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/fetchVenues'
import { LocationMode } from 'libs/location/types'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export const useGetAllVenues = () => {
  const netInfo = useNetInfoContext()

  return useQuery<Venue[]>(
    [QueryKeys.VENUES],
    () =>
      fetchVenues({
        query: '',
        buildLocationParameterParams: {
          userLocation: { latitude: 0, longitude: 0 },
          selectedLocationMode: LocationMode.AROUND_PLACE,
          aroundMeRadius: 'all',
          aroundPlaceRadius: 'all',
        },
      }),
    {
      enabled: !!netInfo.isConnected,
    }
  )
}
