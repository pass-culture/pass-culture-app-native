import { GoogleSignin } from '@react-native-google-signin/google-signin'
// eslint-disable-next-line no-restricted-imports
import { UseGoogleLoginOptionsAuthCodeFlow } from '@react-oauth/google'

import { eventMonitoring } from 'libs/monitoring'

export const useGoogleLogin =
  ({ onSuccess }: UseGoogleLoginOptionsAuthCodeFlow) =>
  async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const { serverAuthCode, scopes = [] } = await GoogleSignin.signIn()
      if (onSuccess && serverAuthCode) {
        onSuccess({ code: serverAuthCode, scope: scopes.join(' ') })
      }
    } catch (e) {
      eventMonitoring.captureMessage(`Can’t login via Google: ${e}`, 'info')
    }
  }
