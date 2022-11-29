import { useQuery } from 'react-query'

import { api } from 'api/api'
import { VenueResponse } from 'api/gen'
import { VenueNotFound } from 'features/venue/pages/VenueNotFound/VenueNotFound'
import { VenueNotFoundError } from 'libs/monitoring/errors'
import { QueryKeys } from 'libs/queryKeys'

const getVenueById = async (venueId: number | null) => {
  if (typeof venueId !== 'number') return
  try {
    return await api.getnativev1venuevenueId(venueId)
  } catch (error) {
    throw new VenueNotFoundError(venueId, VenueNotFound)
  }
}

export const useVenue = (venueId: number | null) =>
  useQuery<VenueResponse | undefined>([QueryKeys.VENUE, venueId], () => getVenueById(venueId), {
    enabled: typeof venueId === 'number',
  })
