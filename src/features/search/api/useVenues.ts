import { useQuery } from 'react-query'

import { SuggestedPlace } from 'libs/place'
import { QueryKeys } from 'libs/queryKeys'
import { fetchVenues } from 'libs/search/fetch/search'

const STALE_TIME_VENUES = 5 * 60 * 1000

export const useVenues = (query: string) =>
  useQuery<SuggestedPlace[]>([QueryKeys.VENUES, query], () => fetchVenues(query), {
    staleTime: STALE_TIME_VENUES,
    enabled: query.length > 0,
  })
