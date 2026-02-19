/// <reference types="google.accounts" />
import { api } from 'api/api'
import { env } from 'libs/environment/env'
import { GoogleLoginOptions } from 'libs/react-native-google-sso/types'

export const loginToGoogle = async ({ onSuccess, onError }: GoogleLoginOptions) => {
  let oauthStateToken: string

  try {
    oauthStateToken = (await api.getNativeV1OauthState()).oauthStateToken
  } catch (error) {
    onError?.(error)
    return
  }

  const client = google.accounts.oauth2.initCodeClient({
    client_id: env.GOOGLE_CLIENT_ID,
    scope: 'openid profile email',
    callback: onSuccess,
    error_callback: onError,
    state: oauthStateToken,
  })

  client?.requestCode()
}
