import { useQuery } from 'react-query'

import { api } from 'api/api'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export function useOAuthState() {
  const enableGoogleSSO = useFeatureFlag('WIP_ENABLE_GOOGLE_SSO')
  const netInfo = useNetInfoContext()

  return useQuery([QueryKeys.OAUTH_STATE], () => api.getNativeV1OauthState(), {
    enabled: !!(netInfo.isConnected && enableGoogleSSO),
  })
}
