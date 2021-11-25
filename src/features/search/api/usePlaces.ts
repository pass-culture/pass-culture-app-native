import { useQuery } from 'react-query'

import { fetchPlaces, PlaceProps, SuggestedPlace } from 'libs/place'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_PLACES = 5 * 60 * 1000

export const usePlaces = ({ query, limit, cityCode, postalCode }: PlaceProps) =>
  useQuery<SuggestedPlace[]>(
    [[QueryKeys.PLACES, query, cityCode, postalCode]],
    () => fetchPlaces({ query, limit, cityCode, postalCode }),
    {
      staleTime: STALE_TIME_PLACES,
      enabled: query.length > 0,
    }
  )
