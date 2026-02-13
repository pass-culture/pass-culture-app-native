import { api } from 'api/api'
import { env } from 'libs/environment/env'
import { GoogleLoginOptions } from 'libs/react-native-google-sso/types'

export const loginToGoogle = async ({ onSuccess }: GoogleLoginOptions) => {
  const oauthStateToken = (await api.getNativeV1OauthState()).oauthStateToken

  const client = window.google.accounts.oauth2.initCodeClient({
    client_id: env.GOOGLE_CLIENT_ID,
    scope: 'openid profile email',
    callback: onSuccess,
    state: oauthStateToken,
  })

  client?.requestCode()
}
