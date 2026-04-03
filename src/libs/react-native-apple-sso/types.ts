export const APPLE_SSO_CALLBACK_MESSAGE_TYPE = 'apple-sso-callback'

export type AppleLoginOptions = {
  onSuccess: ({ code, state }: { code: string; state: string }) => void
  onError?: (error: unknown) => void
}
