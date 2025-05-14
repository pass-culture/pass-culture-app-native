import { useQuery } from '@tanstack/react-query'

import { SuggestedPlace } from 'libs/place//types'
import { fetchPlaces } from 'libs/place/fetchPlaces'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_PLACES = 5 * 60 * 1000
export const MIN_QUERY_LENGTH = 3 // if the query is shorter than 3 characters, it returns: 400, query must contain between 3 and 200 chars and start with a number or a letter

export const usePlaces = ({ query }: { query: string }) => {
  return useQuery<SuggestedPlace[]>(
    [QueryKeys.PLACES, query],
    () => fetchPlaces({ query, limit: 20 }),
    {
      staleTime: STALE_TIME_PLACES,
      enabled: query.length >= MIN_QUERY_LENGTH,
    }
  )
}
