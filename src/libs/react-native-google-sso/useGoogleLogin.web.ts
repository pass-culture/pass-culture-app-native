// eslint-disable-next-line no-restricted-imports
import { useGoogleLogin as useDefaultGoogleLogin } from '@react-oauth/google'

import { useOAuthState } from 'features/auth/api/useOAuthState'
import { GoogleLoginOptions } from 'libs/react-native-google-sso/types'

export const useGoogleLogin = ({ onSuccess }: GoogleLoginOptions) => {
  const { data } = useOAuthState()
  const googleLogin = useDefaultGoogleLogin({
    onSuccess,
    state: data?.oauthStateToken,
    flow: 'auth-code',
  })

  if (!data?.oauthStateToken) return

  return googleLogin
}
