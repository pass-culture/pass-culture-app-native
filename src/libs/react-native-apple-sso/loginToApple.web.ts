import { api } from 'api/api'
import { env } from 'libs/environment/env'
import {
  loadAppleSSOContext,
  saveAppleSSOContext,
} from 'libs/react-native-apple-sso/appleSSOContext'
import { AppleLoginOptions } from 'libs/react-native-apple-sso/types'

const APPLE_AUTH_ENDPOINT = 'https://appleid.apple.com/auth/authorize'

// On web, the redirect flow is used: the page redirects to Apple, and
// AppleSSOCallback handles the response. onSuccess is not called here
// (it's called after redirect in AppleSSOCallback). The signature is
// kept identical to the native version for TypeScript compatibility.
export const loginToApple = async ({ onError }: AppleLoginOptions) => {
  let oauthStateToken: string

  try {
    oauthStateToken = (await api.getNativeV1OauthState()).oauthStateToken
  } catch (error) {
    onError?.(error)
    return
  }

  // Persist the state token in the existing SSO context so the callback
  // can reuse it (CSRF validation) instead of generating a fresh one.
  const context = loadAppleSSOContext()
  if (context) {
    saveAppleSSOContext({ ...context, oauthStateToken })
  }

  const clientId = env.APPLE_SERVICE_ID?.trim()
  if (!clientId) {
    onError?.(new Error('apple_service_id_not_configured'))
    return
  }

  const redirectUri = `${window.location.origin}/oauth/apple/callback`
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_mode: 'query',
    response_type: 'code',
    state: oauthStateToken,
  })

  const authUrl = `${APPLE_AUTH_ENDPOINT}?${params.toString()}`
  window.location.href = authUrl
}
