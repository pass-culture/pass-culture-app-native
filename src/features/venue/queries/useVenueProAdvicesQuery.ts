import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export function useVenueProAdvicesQuery({
  venueId,
  enableProAdvices,
}: {
  venueId: number
  enableProAdvices: boolean
}) {
  return useQuery({
    queryKey: [QueryKeys.VENUE_ADVICES, venueId],
    queryFn: () => api.getNativeV1VenuevenueIdAdvices(venueId),
    enabled: enableProAdvices,
    staleTime: 60 * 60 * 1000,
  })
}
