// eslint-disable-next-line no-restricted-imports
import { GoogleSignin } from '@react-native-google-signin/google-signin'

import { useOAuthStateQuery } from 'features/auth/queries/useOAuthStateQuery'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { GoogleLoginOptions } from 'libs/react-native-google-sso/types'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

export const useGoogleLogin = ({ onSuccess }: GoogleLoginOptions) => {
  const { data } = useOAuthStateQuery()
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
    } catch (error) {
      if (logType === LogTypeEnum.INFO) {
        const errorMessage = getErrorMessage(error)
        eventMonitoring.captureException(`Can’t login via Google: ${errorMessage}`, {
          level: 'info',
          extra: { error },
        })
      }
    }
  }
}
