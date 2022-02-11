import { useQuery } from 'react-query'

import { useNetwork } from 'libs/network/useNetwork'
import { fetchPlaces, SuggestedPlace } from 'libs/place'
import { QueryKeys } from 'libs/queryKeys'

export const usePlaces = ({ query }: { query: string }) => {
  const { isConnected } = useNetwork()

  return useQuery<SuggestedPlace[]>(
    [QueryKeys.PLACES, query],
    () => fetchPlaces({ query, limit: 20 }),
    { enabled: query.length > 0 && isConnected }
  )
}
