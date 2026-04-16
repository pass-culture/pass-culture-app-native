import { AppleSSOContext } from 'libs/react-native-apple-sso/types'

const APPLE_SSO_CONTEXT_KEY = 'apple_sso_context'

export const saveAppleSSOContext = (context: AppleSSOContext) => {
  sessionStorage.setItem(APPLE_SSO_CONTEXT_KEY, JSON.stringify(context))
}

export const loadAppleSSOContext = (): AppleSSOContext | null => {
  const raw = sessionStorage.getItem(APPLE_SSO_CONTEXT_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const clearAppleSSOContext = () => {
  sessionStorage.removeItem(APPLE_SSO_CONTEXT_KEY)
}
