import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

// arbitrary. Should not change that often though
const STALE_TIME_APP_SETTINGS = 5 * 60 * 1000

export const useAppSettingsQuery = () => {
  const netInfo = useNetInfoContext()
  return useQuery({
    queryKey: [QueryKeys.SETTINGS],
    queryFn: () => api.getNativeV1Settings(),
    enabled: !!netInfo.isConnected && !!netInfo.isInternetReachable,
    staleTime: STALE_TIME_APP_SETTINGS,
  })
}
