import { useQuery } from 'react-query'

import { api } from 'api/api'
import { VenueResponse } from 'api/gen'
import { VenueNotFound } from 'features/venue/pages/VenueNotFound/VenueNotFound'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { LogTypeEnum, VenueNotFoundError } from 'libs/monitoring/errors'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

const getVenueById = async (venueId: number | null, logType: LogTypeEnum) => {
  if (typeof venueId !== 'number') return
  try {
    return await api.getNativeV1VenuevenueId(venueId)
  } catch (error) {
    throw new VenueNotFoundError(venueId, {
      Screen: VenueNotFound,
      logType,
    })
  }
}

export const useVenue = (venueId: number | null) => {
  const netInfo = useNetInfoContext()
  const { logType } = useLogTypeFromRemoteConfig()

  return useQuery<VenueResponse | undefined>(
    [QueryKeys.VENUE, venueId],
    () => getVenueById(venueId, logType),
    {
      enabled:
        !!netInfo.isConnected && !!netInfo.isInternetReachable && typeof venueId === 'number',
    }
  )
}
