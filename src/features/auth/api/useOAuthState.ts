import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { QueryKeys } from 'libs/queryKeys'

export function useOAuthState() {
  const enableGoogleSSO = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_GOOGLE_SSO)

  return useQuery({
    queryKey: [QueryKeys.OAUTH_STATE],
    queryFn: () => api.getNativeV1OauthState(),
    enabled: enableGoogleSSO,
  })
}
