import { useQuery } from 'react-query'

import { api } from 'api/api'
import { SettingsResponse } from 'api/gen'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

// arbitrary. Should not change that often though
const STALE_TIME_APP_SETTINGS = 5 * 60 * 1000

export function useAppSettings() {
  const netInfo = useNetInfoContext()
  return useQuery<SettingsResponse>(QueryKeys.SETTINGS, () => api.getnativev1settings(), {
    enabled: !!netInfo.isConnected && !!netInfo.isInternetReachable,
    staleTime: STALE_TIME_APP_SETTINGS,
  })
}
