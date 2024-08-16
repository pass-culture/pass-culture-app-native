import { useQuery } from 'react-query'

import { api } from 'api/api'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export function useOAuthState() {
  const netInfo = useNetInfoContext()

  return useQuery([QueryKeys.OAUTH_STATE], () => api.getNativeV1OauthState(), {
    enabled: !!netInfo.isConnected,
  })
}
