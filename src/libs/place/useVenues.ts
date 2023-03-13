import { useQuery } from 'react-query'

import { Venue } from 'features/venue/types'
import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/fetchVenues'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_VENUES = 5 * 60 * 1000

export const useVenues = (query: string) => {
  const netInfo = useNetInfoContext()
  return useQuery<Venue[]>([QueryKeys.VENUES, query], () => fetchVenues(query), {
    staleTime: STALE_TIME_VENUES,
    enabled: !!netInfo.isConnected && query.length > 0,
  })
}
