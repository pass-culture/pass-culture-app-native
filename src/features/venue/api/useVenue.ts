import { useQuery } from 'react-query'

import { api } from 'api/api'
import { VenueResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

// A venue should not change that often
const STALE_TIME_VENUE = 5 * 60 * 1000

export const useVenue = (venueId: number) =>
  useQuery<VenueResponse>([QueryKeys.VENUE, venueId], () => api.getnativev1venuevenueId(venueId), {
    staleTime: STALE_TIME_VENUE,
  })
