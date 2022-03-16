import { useQuery } from 'react-query'

import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues'
import { QueryKeys } from 'libs/queryKeys'
import { SuggestedVenue } from 'libs/venue'

const STALE_TIME_VENUES = 5 * 60 * 1000

export const useVenues = (query: string) =>
  useQuery<SuggestedVenue[]>([QueryKeys.VENUES, query], () => fetchVenues(query), {
    staleTime: STALE_TIME_VENUES,
    enabled: query.length > 0,
  })
