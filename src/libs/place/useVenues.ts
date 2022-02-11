import { useQuery } from 'react-query'

import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues'
import { useNetwork } from 'libs/network/useNetwork'
import { QueryKeys } from 'libs/queryKeys'
import { SuggestedVenue } from 'libs/venue'

export const useVenues = (query: string) => {
  const { isConnected } = useNetwork()

  return useQuery<SuggestedVenue[]>([QueryKeys.VENUES, query], () => fetchVenues(query), {
    enabled: query.length > 0 && isConnected,
  })
}
