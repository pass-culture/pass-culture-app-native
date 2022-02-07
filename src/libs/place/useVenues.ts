import { useNetInfo } from '@react-native-community/netinfo'
import { useQuery } from 'react-query'

import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues'
import { QueryKeys } from 'libs/queryKeys'
import { SuggestedVenue } from 'libs/venue'

export const useVenues = (query: string) => {
  const networkInfo = useNetInfo()

  return useQuery<SuggestedVenue[]>([QueryKeys.VENUES, query], () => fetchVenues(query), {
    enabled: query.length > 0 && networkInfo.isConnected,
  })
}
