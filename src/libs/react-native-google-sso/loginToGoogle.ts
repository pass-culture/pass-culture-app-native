// eslint-disable-next-line no-restricted-imports
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'

import { api } from 'api/api'
import { GoogleLoginOptions } from 'libs/react-native-google-sso/types'

type GoogleSSOError = { code?: string; message?: string }

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
    const googleError = error as GoogleSSOError // isErrorWithCode() should be used when bump version of @react-native-google-signin/google-signin
    if (googleError.code === statusCodes.SIGN_IN_CANCELLED) return
    onError?.(error)
  }
}
