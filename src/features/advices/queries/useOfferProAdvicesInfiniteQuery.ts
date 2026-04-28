import { useInfiniteQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

import {
  FIRST_PRO_ADVICES_PAGE,
  getNextProAdvicesPageParam,
  PRO_ADVICES_RESULTS_PER_PAGE,
} from './proAdvicesPagination'

export function useOfferProAdvicesInfiniteQuery({
  offerId,
  enableProAdvices,
  latitude,
  longitude,
}: {
  offerId: number
  enableProAdvices: boolean
  latitude?: number
  longitude?: number
}) {
  return useInfiniteQuery({
    queryKey: [
      QueryKeys.OFFER_PRO_ADVICES,
      offerId,
      'infinite',
      PRO_ADVICES_RESULTS_PER_PAGE,
      latitude,
      longitude,
    ],
    queryFn: ({ pageParam }) =>
      api.getNativeV1OfferofferIdAdvices(
        offerId,
        undefined,
        pageParam,
        PRO_ADVICES_RESULTS_PER_PAGE,
        latitude,
        longitude
      ),
    initialPageParam: FIRST_PRO_ADVICES_PAGE,
    getNextPageParam: getNextProAdvicesPageParam,
    enabled: enableProAdvices,
    staleTime: 60 * 60 * 1000,
  })
}
