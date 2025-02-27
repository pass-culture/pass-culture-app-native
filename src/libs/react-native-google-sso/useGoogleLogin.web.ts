// eslint-disable-next-line no-restricted-imports
import { useGoogleLogin as useDefaultGoogleLogin } from '@react-oauth/google'

import { useOAuthStateQuery } from 'features/auth/queries/useOAuthStateQuery'
import { GoogleLoginOptions } from 'libs/react-native-google-sso/types'

export const useGoogleLogin = ({ onSuccess }: GoogleLoginOptions) => {
  const { data } = useOAuthStateQuery()
  const googleLogin = useDefaultGoogleLogin({
    onSuccess,
    state: data?.oauthStateToken,
    flow: 'auth-code',
  })

  if (!data?.oauthStateToken) return

  return googleLogin
}
