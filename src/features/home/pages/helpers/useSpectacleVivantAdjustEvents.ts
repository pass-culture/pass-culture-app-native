import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

import { CookieNameEnum } from 'features/cookies/enums'
import {
  selectHasAcceptedCookie,
  useCookiesConsentStore,
} from 'features/cookies/store/cookiesConsentStore'
import { Adjust } from 'libs/adjust/adjust'
import { env } from 'libs/environment/env'
import { AdjustEvents } from 'shared/adjust/adjustEvents'

// entry ID of the spectacle vivant home in each Contentful environment (CONTENTFUL_ENVIRONMENT)
const SPECTACLE_VIVANT_HOME_ID: Record<string, string | undefined> = {
  master: '3g0blWv0UfxJC2XQ2KSkcG', // "Marketing | Home spectacle vivant"
  testing: '3S4UGnN2tfPIV1ANpdUYs6', // "Home catégorielle spectacle vivant"
}

export const useSpectacleVivantAdjustEvents = (homeId: string) => {
  const hasAcceptedAdjustCookies = useCookiesConsentStore(
    selectHasAcceptedCookie(CookieNameEnum.ADJUST)
  )

  useFocusEffect(
    useCallback(() => {
      // the Adjust SDK drops the events sent before its initialization, which follows the Adjust cookies consent
      if (!hasAcceptedAdjustCookies) return
      if (homeId !== SPECTACLE_VIVANT_HOME_ID[env.CONTENTFUL_ENVIRONMENT]) return
      Adjust.logEvent(AdjustEvents.SPECTACLE_VIVANT)
    }, [homeId, hasAcceptedAdjustCookies])
  )
}
