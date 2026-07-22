import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { OfferChronicles } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export const useClubAdvicesQuery = <
  TData = Awaited<ReturnType<typeof api.getNativeV1OfferofferIdChronicles>>,
>({
  offerId,
  select,
  enabled = true,
}: {
  offerId: number
  select?: (data: OfferChronicles) => TData
  enabled?: boolean
}) =>
  useQuery({
    queryKey: [QueryKeys.CLUB_ADVICES, offerId],
    queryFn: () => api.getNativeV1OfferofferIdChronicles(offerId),
    enabled: !!offerId && enabled,
    select,
  })
