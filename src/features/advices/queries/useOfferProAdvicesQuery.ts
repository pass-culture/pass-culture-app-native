import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { OfferProAdvices } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export function useOfferProAdvicesQuery<
  TData = Awaited<ReturnType<typeof api.getNativeV1OfferofferIdAdvices>>,
>({
  offerId,
  enableProAdvices,
  latitude,
  longitude,
  select,
}: {
  offerId: number
  enableProAdvices: boolean
  latitude?: number
  longitude?: number
  select?: (data: OfferProAdvices) => TData
}) {
  return useQuery({
    queryKey: [QueryKeys.OFFER_PRO_ADVICES, offerId],
    queryFn: () =>
      api.getNativeV1OfferofferIdAdvices(
        offerId,
        undefined,
        undefined,
        undefined,
        latitude,
        longitude
      ),
    enabled: enableProAdvices,
    staleTime: 60 * 60 * 1000,
    select,
  })
}
