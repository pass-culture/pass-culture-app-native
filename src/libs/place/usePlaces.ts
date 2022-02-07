import { useNetInfo } from '@react-native-community/netinfo'
import { useQuery } from 'react-query'

import { fetchPlaces, SuggestedPlace } from 'libs/place'
import { QueryKeys } from 'libs/queryKeys'

export const usePlaces = ({ query }: { query: string }) => {
  const networkInfo = useNetInfo()

  return useQuery<SuggestedPlace[]>(
    [QueryKeys.PLACES, query],
    () => fetchPlaces({ query, limit: 20 }),
    { enabled: query.length > 0 && networkInfo.isConnected }
  )
}
