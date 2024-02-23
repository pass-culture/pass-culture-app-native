import { useQuery } from 'react-query'

import { Venue } from 'features/venue/types'
import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/fetchVenues'
import { LocationMode } from 'libs/location/types'
import { Region } from 'libs/maps/maps'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

type Props = {
  region: Region
  radius: number
}

export const useGetAllVenues = ({ region, radius }: Props) => {
  const netInfo = useNetInfoContext()

  return useQuery<Venue[]>(
    [QueryKeys.VENUES, region],
    () =>
      fetchVenues({
        query: '',
        buildLocationParameterParams: {
          userLocation: { latitude: region.latitude, longitude: region.longitude },
          selectedLocationMode: LocationMode.AROUND_PLACE,
          aroundMeRadius: 'all',
          aroundPlaceRadius: radius,
        },
      }),
    {
      enabled: !!netInfo.isConnected,
    }
  )
}
