import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { VenueResponse } from 'api/gen'
import { VenueNotFound } from 'features/venue/pages/VenueNotFound/VenueNotFound'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { LogTypeEnum, VenueNotFoundError } from 'libs/monitoring/errors'
import { QueryKeys } from 'libs/queryKeys'

const getVenueById = async (venueId: number, logType: LogTypeEnum) => {
  try {
    return await api.getNativeV1VenuevenueId(venueId)
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      throw new VenueNotFoundError(venueId, {
        Screen: VenueNotFound,
        logType,
      })
    }
    throw error
  }
}

export const useVenueQuery = (venueId: number, options?: { enabled?: boolean }) => {
  const { logType } = useLogTypeFromRemoteConfig()

  return useQuery<VenueResponse | undefined>(
    [QueryKeys.VENUE, venueId],
    () => getVenueById(venueId, logType),
    {
      enabled: options?.enabled ?? true,
    }
  )
}
