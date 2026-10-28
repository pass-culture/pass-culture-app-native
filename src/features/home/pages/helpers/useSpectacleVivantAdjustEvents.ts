import { useEffect } from 'react'

import {
  spectacleVivantAdjustEventsStoreActions,
  spectacleVivantAdjustEventsStoreSelectors,
} from 'features/home/pages/helpers/spectacleVivantAdjustEventsStore'
import { Adjust } from 'libs/adjust/adjust'
import { env } from 'libs/environment/env'
import { AdjustEvents } from 'shared/adjust/adjustEvents'

// entry ID of the spectacle vivant home in each Contentful environment (CONTENTFUL_ENVIRONMENT)
const SPECTACLE_VIVANT_HOME_ID: Record<string, string | undefined> = {
  master: '3g0blWv0UfxJC2XQ2KSkcG', // "Marketing | Home spectacle vivant"
  testing: '3S4UGnN2tfPIV1ANpdUYs6', // "Home catégorielle spectacle vivant"
}

export const logSpectacleVivantAdjustEvents = (homeId: string) => {
  if (homeId !== SPECTACLE_VIVANT_HOME_ID[env.CONTENTFUL_ENVIRONMENT]) return

  // Check isEnabled to avoid skewed data because of users who refused the Adjust cookies.
  // Nothing is marked as sent then: the events are sent if the user accepts them later in the session.
  Adjust.isEnabled((isEnabled) => {
    if (!isEnabled) return

    // Each event is sent once per session, so that going back and forth does not inflate the campaign figures
    if (!spectacleVivantAdjustEventsStoreSelectors.selectWasSpectacleVivantEventSentThisSession()) {
      Adjust.logEvent(AdjustEvents.SPECTACLE_VIVANT)
      spectacleVivantAdjustEventsStoreActions.setWasSpectacleVivantEventSentThisSession(true)
    }

    if (
      spectacleVivantAdjustEventsStoreSelectors.selectIsFirstSessionAfterInstall() &&
      !spectacleVivantAdjustEventsStoreSelectors.selectWasNewSpectacleVivantEventSentThisSession()
    ) {
      Adjust.logEvent(AdjustEvents.NEW_SPECTACLE_VIVANT)
      spectacleVivantAdjustEventsStoreActions.setWasNewSpectacleVivantEventSentThisSession(true)
    }
  })
}

export const useSpectacleVivantAdjustEvents = (homeId: string) => {
  useEffect(() => {
    logSpectacleVivantAdjustEvents(homeId)
  }, [homeId])
}
