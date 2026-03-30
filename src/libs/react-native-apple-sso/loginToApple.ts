// eslint-disable-next-line no-restricted-imports
import appleAuth from '@invertase/react-native-apple-authentication'

import { api } from 'api/api'
import { AppleLoginOptions } from 'libs/react-native-apple-sso/types'

export const loginToApple = async ({ onSuccess, onError }: AppleLoginOptions) => {
  try {
    const { oauthStateToken } = await api.getNativeV1OauthState()

    const appleResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    })

    if (!appleResponse.authorizationCode) {
      onError?.(new Error('Apple Sign-In returned no authorization code'))
      return
    }

    onSuccess({ code: appleResponse.authorizationCode, state: oauthStateToken })
  } catch (error) {
    const appleError = error as { code?: string }
    if (appleError.code === appleAuth.Error.CANCELED) return
    onError?.(error)
  }
}
