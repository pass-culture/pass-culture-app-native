import { AppleSSOContext } from 'libs/react-native-apple-sso/types'

// Native stub — sessionStorage is not used on native (Apple SSO uses OS-level SDK)
export const saveAppleSSOContext = (_context: AppleSSOContext) => {
  // no-op on native
}

export const loadAppleSSOContext = (): AppleSSOContext | null => {
  return null
}

export const clearAppleSSOContext = () => {
  // no-op on native
}
