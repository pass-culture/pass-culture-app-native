import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { OfferChronicles } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export function useChroniclesQuery<
  TData = Awaited<ReturnType<typeof api.getNativeV1OfferofferIdChronicles>>,
>({ offerId, select }: { offerId: number; select?: (data: OfferChronicles) => TData }) {
  return useQuery({
    queryKey: [QueryKeys.OFFER_CHRONICLES, offerId],
    queryFn: () => api.getNativeV1OfferofferIdChronicles(offerId),
    enabled: !!offerId,
    select,
  })
}
