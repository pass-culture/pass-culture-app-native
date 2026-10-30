import { useRef } from 'react'

import { useCookiesConsentStore } from 'features/cookies/store/cookiesConsentStore'
import { spectacleVivantAdjustEventsStoreActions } from 'features/home/pages/helpers/spectacleVivantAdjustEventsStore'
import { selectHasAcceptedAdjustCookies } from 'features/home/pages/helpers/useSpectacleVivantAdjustEvents'
import { useAppStateChange } from 'libs/appState'

// Adjust starts a new session when the app comes back after more than 30 minutes in background
// (sessionInterval of the Adjust SDK, ADJAdjustFactory.m and AdjustFactory.java)
const ADJUST_SESSION_INTERVAL_IN_MS = 30 * 60 * 1000

export const useSpectacleVivantAdjustSession = () => {
  const inBackgroundSince = useRef<number | null>(null)

  useAppStateChange(
    () => {
      if (
        inBackgroundSince.current !== null &&
        Date.now() - inBackgroundSince.current > ADJUST_SESSION_INTERVAL_IN_MS
      ) {
        spectacleVivantAdjustEventsStoreActions.startNewSession()
      }
      inBackgroundSince.current = null
    },
    () => {
      // Adjust sessions start with the SDK, once the Adjust cookies are accepted: before that, the first launch
      // through a campaign link must keep its first session whatever the time spent on the cookies consent modal
      if (!selectHasAcceptedAdjustCookies(useCookiesConsentStore.getState())) return
      inBackgroundSince.current = Date.now()
    }
  )
}
