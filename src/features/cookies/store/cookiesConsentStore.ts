// eslint-disable-next-line no-restricted-imports
import { create } from 'zustand'

import { ConsentState, CookieNameEnum } from 'features/cookies/enums'
import { ConsentStatus } from 'features/cookies/types'

type CookiesConsentStoreState = {
  cookiesConsent: ConsentStatus
  isInitialized: boolean
}

type CookiesConsentStoreActions = {
  setCookiesConsentState: (cookiesConsent: ConsentStatus) => void
  resetCookiesConsentState: () => void
}

type CookiesConsentStore = CookiesConsentStoreState & CookiesConsentStoreActions

const DEFAULT_STATE: CookiesConsentStoreState = {
  cookiesConsent: { state: ConsentState.LOADING },
  isInitialized: false,
}

export const useCookiesConsentStore = create<CookiesConsentStore>()((set) => ({
  ...DEFAULT_STATE,
  setCookiesConsentState: (cookiesConsent: ConsentStatus) =>
    set({ cookiesConsent, isInitialized: true }),
  resetCookiesConsentState: () => set(DEFAULT_STATE),
}))

export const selectHasAcceptedCookie =
  (cookie: CookieNameEnum) =>
  ({ cookiesConsent }: CookiesConsentStoreState) =>
    cookiesConsent.state === ConsentState.HAS_CONSENT &&
    cookiesConsent.value.accepted.includes(cookie)
