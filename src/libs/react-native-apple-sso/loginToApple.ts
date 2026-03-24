// eslint-disable-next-line no-restricted-imports
import appleAuth from '@invertase/react-native-apple-authentication'

import { api } from 'api/api'
import { AppleLoginOptions } from 'libs/react-native-apple-sso/types'

export const loginToApple = async ({ onSuccess, onError }: AppleLoginOptions) => {
  try {
    console.log('[AppleSSO] Starting appleAuth.performRequest...')
    const appleResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    })
    console.log('[AppleSSO] appleAuth response received:', {
      hasAuthorizationCode: !!appleResponse.authorizationCode,
      hasIdentityToken: !!appleResponse.identityToken,
      user: appleResponse.user,
      email: appleResponse.email,
      fullName: appleResponse.fullName,
    })

    if (!appleResponse.authorizationCode) {
      console.log('[AppleSSO] ERROR: No authorization code returned')
      onError?.(new Error('Apple Sign-In returned no authorization code'))
      return
    }

    console.log('[AppleSSO] Fetching oauthStateToken...')
    const { oauthStateToken } = await api.getNativeV1OauthState()
    console.log('[AppleSSO] Got oauthStateToken, calling onSuccess with code + state')
    onSuccess({ code: appleResponse.authorizationCode, state: oauthStateToken })
  } catch (error) {
    const appleError = error as { code?: string }
    console.log('[AppleSSO] CATCH error:', { code: appleError.code, error })
    if (appleError.code === appleAuth.Error.CANCELED) return
    onError?.(error)
  }
}
