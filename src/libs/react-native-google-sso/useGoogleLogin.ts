// eslint-disable-next-line no-restricted-imports
import { GoogleSignin } from '@react-native-google-signin/google-signin'

import { useOAuthState } from 'features/auth/api/useOAuthState'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { eventMonitoring } from 'libs/monitoring'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { GoogleLoginOptions } from 'libs/react-native-google-sso/types'

export const useGoogleLogin = ({ onSuccess }: GoogleLoginOptions) => {
  const { data } = useOAuthState()
  const { logType } = useLogTypeFromRemoteConfig()

  if (!data?.oauthStateToken) return

  return async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      })
      const { serverAuthCode } = await GoogleSignin.signIn()
      if (onSuccess && serverAuthCode) {
        onSuccess({
          code: serverAuthCode,
          state: data.oauthStateToken,
        })
      }
    } catch (e) {
      if (logType === LogTypeEnum.INFO)
        eventMonitoring.captureException(`Can’t login via Google: ${e}`, { level: 'info' })
    }
  }
}
