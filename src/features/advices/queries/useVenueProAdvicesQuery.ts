import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { VenueProAdvices } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export function useVenueProAdvicesQuery<
  TData = Awaited<ReturnType<typeof api.getNativeV1VenuevenueIdAdvices>>,
>({
  venueId,
  enableProAdvices,
  select,
}: {
  venueId: number
  enableProAdvices: boolean
  select?: (data: VenueProAdvices) => TData
}) {
  return useQuery({
    queryKey: [QueryKeys.VENUE_PRO_ADVICES, venueId],
    queryFn: () => api.getNativeV1VenuevenueIdAdvices(venueId),
    enabled: enableProAdvices,
    staleTime: 60 * 60 * 1000,
    select,
  })
}
