import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

import { ConsentState, CookieNameEnum } from 'features/cookies/enums'
import { useCookiesConsentStore } from 'features/cookies/store/cookiesConsentStore'
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

  // isEnabled covers Adjust disabled after a consent withdrawal. Before the SDK initialization, it answers true
  // and the SDK drops the events: the hook only calls this function once the Adjust cookies are accepted.
  // Nothing is marked as sent when Adjust is disabled: the events are sent if it is enabled again in the session.
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
  // The cookies consent modal is displayed over the page without blurring it (first launch through a campaign link):
  // the events of the current arrival are sent once the Adjust cookies are accepted
  const hasAcceptedAdjustCookies = useCookiesConsentStore(
    ({ cookiesConsent }) =>
      cookiesConsent.state === ConsentState.HAS_CONSENT &&
      cookiesConsent.value.accepted.includes(CookieNameEnum.ADJUST)
  )

  // On focus rather than on mount: the page stays mounted while the user navigates further, then comes back to it
  useFocusEffect(
    useCallback(() => {
      if (!hasAcceptedAdjustCookies) return
      logSpectacleVivantAdjustEvents(homeId)
    }, [homeId, hasAcceptedAdjustCookies])
  )
}
