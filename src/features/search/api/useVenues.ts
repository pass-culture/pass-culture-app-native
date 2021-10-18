import { useQuery } from 'react-query'

import { fetchVenues as fetchAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues'
import { QueryKeys } from 'libs/queryKeys'
import { fetchVenues as fetchAppSearchVenues } from 'libs/search/fetch/search'
import { useAppSearchBackend } from 'libs/search/fetch/useAppSearchBackend'
import { SuggestedVenue } from 'libs/venue'

const STALE_TIME_VENUES = 5 * 60 * 1000

export const useVenues = (query: string) => {
  const { enabled, isAppSearchBackend } = useAppSearchBackend()

  const fetchVenuesFn = isAppSearchBackend ? fetchAppSearchVenues : fetchAlgoliaVenues

  return useQuery<SuggestedVenue[]>([QueryKeys.VENUES, query], () => fetchVenuesFn(query), {
    staleTime: STALE_TIME_VENUES,
    // TODO(antoinewg) remove condition once migration to AppSearch is complete
    enabled: query.length > 0 && enabled,
  })
}
