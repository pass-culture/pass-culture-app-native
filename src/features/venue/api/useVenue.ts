import { useQuery } from 'react-query'

import { api } from 'api/api'
import { VenueResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

// A venue should not change that often
const STALE_TIME_VENUE = 5 * 60 * 1000

const getVenueById = async (venueId: number | null) => {
  if (typeof venueId !== 'number') return
  return await api.getnativev1venuevenueId(venueId)
}

export const useVenue = (venueId: number | null) =>
  useQuery<VenueResponse | undefined>([QueryKeys.VENUE, venueId], () => getVenueById(venueId), {
    staleTime: STALE_TIME_VENUE,
    enabled: typeof venueId === 'number',
  })
