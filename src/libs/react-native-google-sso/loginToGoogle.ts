// eslint-disable-next-line no-restricted-imports
import { GoogleSignin } from '@react-native-google-signin/google-signin'

import { api } from 'api/api'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'
import { eventMonitoring } from 'libs/monitoring/services'
import { QueryKeys } from 'libs/queryKeys'
import { GoogleLoginOptions } from 'libs/react-native-google-sso/types'
import { queryClient } from 'libs/react-query/queryClient'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

export const loginToGoogle = async ({ onSuccess }: GoogleLoginOptions) => {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    })
    const { serverAuthCode } = await GoogleSignin.signIn()
    if (serverAuthCode) {
      onSuccess({
        code: serverAuthCode,
        state: (await api.getNativeV1OauthState()).oauthStateToken,
      })
    }
  } catch (error) {
    const remoteConfig = await queryClient.ensureQueryData<CustomRemoteConfig>({
      queryKey: [QueryKeys.REMOTE_CONFIG],
    })
    if (remoteConfig.shouldLogInfo) {
      const errorMessage = getErrorMessage(error)
      eventMonitoring.captureException(`Can’t login via Google: ${errorMessage}`, {
        level: 'info',
        extra: { error },
      })
    }
  }
}
