// eslint-disable-next-line no-restricted-imports
import { GoogleSignin } from '@react-native-google-signin/google-signin'
// eslint-disable-next-line no-restricted-imports
import { UseGoogleLoginOptionsAuthCodeFlow } from '@react-oauth/google'

import { useOAuthState } from 'features/auth/api/useOAuthState'
import { eventMonitoring } from 'libs/monitoring'

export const useGoogleLogin = ({ onSuccess }: UseGoogleLoginOptionsAuthCodeFlow) => {
  const { data } = useOAuthState()

  if (!data?.oauthStateToken) return

  return async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      })
      const { serverAuthCode, scopes = [] } = await GoogleSignin.signIn()
      if (onSuccess && serverAuthCode) {
        onSuccess({
          code: serverAuthCode,
          scope: scopes.join(' '),
          state: data.oauthStateToken,
        })
      }
    } catch (e) {
      eventMonitoring.captureMessage(`Can’t login via Google: ${e}`, 'info')
    }
  }
}
