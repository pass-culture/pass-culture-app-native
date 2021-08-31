import { useQuery } from 'react-query'

import { fetchPlaces, SuggestedPlace } from 'libs/place'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_PLACES = 5 * 60 * 1000

export const usePlaces = (query: string) =>
  useQuery<SuggestedPlace[]>([QueryKeys.PLACES, query], () => fetchPlaces({ query }), {
    staleTime: STALE_TIME_PLACES,
    enabled: query.length > 0,
  })
