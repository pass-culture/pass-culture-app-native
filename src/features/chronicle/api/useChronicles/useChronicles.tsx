import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { OfferChronicles } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export function useChronicles<
  TData = Awaited<ReturnType<typeof api.getNativeV1OfferofferIdChronicles>>,
>({ offerId, select }: { offerId: number; select?: (data: OfferChronicles) => TData }) {
  return useQuery(
    [QueryKeys.OFFER_CHRONICLES, offerId],
    () => api.getNativeV1OfferofferIdChronicles(offerId),
    {
      enabled: !!offerId,
      select,
    }
  )
}
