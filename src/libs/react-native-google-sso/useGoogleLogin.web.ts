// eslint-disable-next-line no-restricted-imports
import {
  useGoogleLogin as useDefaultGoogleLogin,
  UseGoogleLoginOptionsAuthCodeFlow,
} from '@react-oauth/google'

import { useOAuthState } from 'features/auth/api/useOAuthState'

export const useGoogleLogin = (options: UseGoogleLoginOptionsAuthCodeFlow) => {
  const { data } = useOAuthState()
  const googleLogin = useDefaultGoogleLogin({ ...options, state: data?.oauthStateToken })

  if (!data?.oauthStateToken) return

  return googleLogin
}
