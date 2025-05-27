import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { VenueResponse } from 'api/gen'
import { VenueNotFound } from 'features/venue/pages/VenueNotFound/VenueNotFound'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { VenueNotFoundError } from 'libs/monitoring/errors'
import { QueryKeys } from 'libs/queryKeys'

export const useVenueQuery = (venueId: number, options?: { enabled?: boolean }) => {
  const { logType } = useLogTypeFromRemoteConfig()

  return useQuery<VenueResponse | undefined>(
    [QueryKeys.VENUE, venueId],
    () => api.getNativeV1VenuevenueId(venueId),
    {
      onError: (_error) => {
        throw new VenueNotFoundError(venueId, {
          Screen: VenueNotFound,
          logType,
        })
      },
      enabled: options?.enabled ?? true,
    }
  )
}
