import { useQuery } from 'react-query'

import { api } from 'api/api'
import { VenueResponse } from 'api/gen'
import { VenueNotFound } from 'features/venue/pages/VenueNotFound'
import { VenueNotFoundError } from 'libs/monitoring/errors'
import { useNetwork } from 'libs/network/useNetwork'
import { QueryKeys } from 'libs/queryKeys'

const getVenueById = async (venueId: number | null) => {
  if (typeof venueId !== 'number') return
  try {
    return await api.getnativev1venuevenueId(venueId)
  } catch (error) {
    throw new VenueNotFoundError(venueId, VenueNotFound)
  }
}

export const useVenue = (venueId: number | null) => {
  const { isConnected } = useNetwork()

  return useQuery<VenueResponse | undefined>(
    [QueryKeys.VENUE, venueId],
    () => getVenueById(venueId),
    { enabled: typeof venueId === 'number' && isConnected }
  )
}
