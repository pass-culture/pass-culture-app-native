// import { PoiNotFound } from 'features/poi/pages/PoiNotFound/PoiNotFound'
import { useQuery } from 'react-query'

import { api } from 'api/api'
import { VenueResponse } from 'api/gen'
import { VenueNotFound } from 'features/venue/pages/VenueNotFound/VenueNotFound'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { LogTypeEnum, VenueNotFoundError } from 'libs/monitoring/errors'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

const getPoiById = async (poiId: number | null, logType: LogTypeEnum) => {
  if (typeof poiId !== 'number') return
  try {
    return await api.getNativeV1VenuevenueId(poiId)
  } catch (error) {
    throw new VenueNotFoundError(poiId, {
      Screen: VenueNotFound,
      logType,
    })
  }
}

export const usePoi = (poiId: number | null) => {
  const netInfo = useNetInfoContext()
  const { logType } = useLogTypeFromRemoteConfig()

  return useQuery<VenueResponse | undefined>(
    [QueryKeys.POI, poiId],
    () => getPoiById(poiId, logType),
    {
      enabled: !!netInfo.isConnected && typeof poiId === 'number',
    }
  )
}
