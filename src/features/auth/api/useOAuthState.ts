import { useQuery } from 'react-query'

import { api } from 'api/api'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export function useOAuthState() {
  const enableGoogleSSO = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_GOOGLE_SSO)
  const netInfo = useNetInfoContext()

  return useQuery([QueryKeys.OAUTH_STATE], () => api.getNativeV1OauthState(), {
    enabled: !!(netInfo.isConnected && netInfo.isInternetReachable && enableGoogleSSO),
  })
}
