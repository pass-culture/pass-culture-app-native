import { useQuery } from 'react-query'

import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { fetchPlaces, SuggestedPlace } from 'libs/place'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_PLACES = 5 * 60 * 1000

export const usePlaces = ({ query }: { query: string }) => {
  const netInfo = useNetInfoContext()
  return useQuery<SuggestedPlace[]>(
    [QueryKeys.PLACES, query],
    () => fetchPlaces({ query, limit: 20 }),
    {
      staleTime: STALE_TIME_PLACES,
      enabled: !!netInfo.isConnected && query.length > 0,
    }
  )
}
