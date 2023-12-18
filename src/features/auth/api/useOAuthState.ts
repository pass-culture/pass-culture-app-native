import { useQuery } from 'react-query'

import { api } from 'api/api'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

const OAUTH_STATE_STALE_TIME = 60 * 60 * 1000

export function useOAuthState() {
  const netInfo = useNetInfoContext()

  return useQuery([QueryKeys.OAUTH_STATE], () => api.getNativeV1OauthState(), {
    enabled: !!netInfo.isConnected,
    staleTime: OAUTH_STATE_STALE_TIME,
  })
}
