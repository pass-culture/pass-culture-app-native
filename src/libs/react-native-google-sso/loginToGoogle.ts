// eslint-disable-next-line no-restricted-imports
import { GoogleSignin } from '@react-native-google-signin/google-signin'

import { api } from 'api/api'
import { GoogleLoginOptions } from 'libs/react-native-google-sso/types'

export const loginToGoogle = async ({ onSuccess, onError }: GoogleLoginOptions) => {
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
    onError?.(error)
  }
}
