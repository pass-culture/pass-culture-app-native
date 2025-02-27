// eslint-disable-next-line no-restricted-imports
import { useGoogleLogin as useDefaultGoogleLogin } from '@react-oauth/google'

import { useOAuthStateQuery } from 'features/auth/queries/useOAuthStateQuery'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { GoogleLoginOptions } from 'libs/react-native-google-sso/types'

export const useGoogleLogin = ({ onSuccess }: GoogleLoginOptions) => {
  const enableGoogleSSO = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_GOOGLE_SSO)
  const { data } = useOAuthStateQuery({ enabled: enableGoogleSSO })
  const googleLogin = useDefaultGoogleLogin({
    onSuccess,
    state: data?.oauthStateToken,
    flow: 'auth-code',
  })

  if (!data?.oauthStateToken) return

  return googleLogin
}
