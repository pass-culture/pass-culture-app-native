import { useQuery } from 'react-query'

import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { Venue } from 'libs/venue'

const STALE_TIME_VENUES = 5 * 60 * 1000

export const useVenues = (query: string) => {
  const netInfo = useNetInfoContext()
  return useQuery<Venue[]>([QueryKeys.VENUES, query], () => fetchVenues(query), {
    staleTime: STALE_TIME_VENUES,
    enabled: !!netInfo.isConnected && query.length > 0,
  })
}
