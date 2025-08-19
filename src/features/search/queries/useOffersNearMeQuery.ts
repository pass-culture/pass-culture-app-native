import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { FetchOffersResponse } from 'libs/algolia/fetchAlgolia/fetchOffers'
import { fetchOffersNearMe } from 'libs/algolia/fetchAlgolia/fetchOffersNearMe'
import { Position } from 'libs/location'
import { QueryKeys } from 'libs/queryKeys'

export const useOffersNearMeQuery = (
  userLocation: Position
): UseQueryResult<FetchOffersResponse['hits']> =>
  useQuery({
    queryKey: [QueryKeys.OFFERS_NEAR_ME],
    queryFn: () => fetchOffersNearMe({ userLocation }),
    select: (data) => data.hits,
  })
