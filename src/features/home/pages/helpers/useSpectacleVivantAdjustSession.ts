import { useRef } from 'react'

import { spectacleVivantAdjustEventsStoreActions } from 'features/home/pages/helpers/spectacleVivantAdjustEventsStore'
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
      inBackgroundSince.current = Date.now()
    }
  )
}
