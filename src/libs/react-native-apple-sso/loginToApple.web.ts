import { appleAuthHelpers } from 'react-apple-signin-auth'

import { api } from 'api/api'
import { env } from 'libs/environment/env'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { AppleLoginOptions } from 'libs/react-native-apple-sso/types'

export const loginToApple = async ({ onSuccess, onError }: AppleLoginOptions) => {
  let oauthStateToken: string

  try {
    oauthStateToken = (await api.getNativeV1OauthState()).oauthStateToken
  } catch (error) {
    onError?.(error)
    return
  }

  await appleAuthHelpers.signIn({
    authOptions: {
      clientId: env.APPLE_SERVICE_ID as string,
      redirectURI: `${WEBAPP_V2_URL}/oauth/apple/callback`,
      scope: 'email name',
      state: oauthStateToken,
      usePopup: true,
    },
    onSuccess: (response: { authorization?: { code?: string } }) => {
      if (!response?.authorization?.code) return
      onSuccess({ code: response.authorization.code, state: oauthStateToken })
    },
    onError: (error: unknown) => {
      const appleError = error as { error?: string }
      if (appleError?.error !== 'popup_closed_by_user') {
        onError?.(error)
      }
    },
  })
}
