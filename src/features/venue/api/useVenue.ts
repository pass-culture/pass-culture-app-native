import { useQuery } from 'react-query'

import { api } from 'api/api'
import { VenueResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

const getVenueById = async (venueId: number | null) => {
  if (typeof venueId !== 'number') return
  return await api.getnativev1venuevenueId(venueId)
}

export const useVenue = (venueId: number | null) =>
  useQuery<VenueResponse | undefined>([QueryKeys.VENUE, venueId], () => getVenueById(venueId), {
    enabled: typeof venueId === 'number',
  })
