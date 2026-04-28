import { useInfiniteQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

import {
  FIRST_PRO_ADVICES_PAGE,
  getNextProAdvicesPageParam,
  PRO_ADVICES_RESULTS_PER_PAGE,
} from './proAdvicesPagination'

export function useVenueProAdvicesInfiniteQuery({
  venueId,
  enableProAdvices,
}: {
  venueId: number
  enableProAdvices: boolean
}) {
  return useInfiniteQuery({
    queryKey: [QueryKeys.VENUE_PRO_ADVICES, venueId, 'infinite', PRO_ADVICES_RESULTS_PER_PAGE],
    queryFn: ({ pageParam }) =>
      api.getNativeV1VenuevenueIdAdvices(
        venueId,
        undefined,
        pageParam,
        PRO_ADVICES_RESULTS_PER_PAGE
      ),
    initialPageParam: FIRST_PRO_ADVICES_PAGE,
    getNextPageParam: getNextProAdvicesPageParam,
    enabled: enableProAdvices,
    staleTime: 60 * 60 * 1000,
  })
}
