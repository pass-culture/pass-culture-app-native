import { api } from 'api/api'
import { env } from 'libs/environment/env'
import {
  APPLE_SSO_CALLBACK_MESSAGE_TYPE,
  AppleLoginOptions,
} from 'libs/react-native-apple-sso/types'

const APPLE_AUTH_ENDPOINT = 'https://appleid.apple.com/auth/authorize'

export const loginToApple = async ({ onSuccess, onError }: AppleLoginOptions) => {
  let oauthStateToken: string

  try {
    oauthStateToken = (await api.getNativeV1OauthState()).oauthStateToken
  } catch (error) {
    onError?.(error)
    return
  }

  const clientId = env.APPLE_SERVICE_ID?.trim()
  if (!clientId) {
    onError?.(new Error('apple_service_id_not_configured'))
    return
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${window.location.origin}/oauth/apple/callback`,
    response_mode: 'query',
    response_type: 'code',
    state: oauthStateToken,
  })

  const authUrl = `${APPLE_AUTH_ENDPOINT}?${params.toString()}`
  const popup = window.open(authUrl, 'apple-sso', 'width=500,height=600,left=200,top=100')

  if (!popup) {
    onError?.(new Error('popup_blocked'))
    return
  }

  return new Promise<void>((resolve) => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type !== APPLE_SSO_CALLBACK_MESSAGE_TYPE) return

      window.removeEventListener('message', handleMessage)
      clearInterval(checkClosed)

      const { code, state, error } = event.data as {
        type: string
        code: string
        state: string
        error?: string
      }
      if (error) {
        onError?.(new Error(`apple_auth_error: ${error}`))
      } else if (code) {
        onSuccess({ code, state })
      } else {
        onError?.(new Error('no_code_in_callback'))
      }
      resolve()
    }

    window.addEventListener('message', handleMessage)

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        window.removeEventListener('message', handleMessage)
        resolve()
      }
    }, 500)
  })
}
