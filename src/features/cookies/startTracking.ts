import appsFlyer from 'react-native-appsflyer'

import { CookieNameEnum, Cookies } from 'features/cookies/CookiesPolicy'
import { amplitude } from 'libs/amplitude'
import { analytics } from 'libs/firebase/analytics'

export const startTracking = (enabled: boolean) => {
  if (enabled) {
    appsFlyer.stop(false)
    amplitude().enableCollection()
    analytics.enableCollection()
  } else {
    appsFlyer.stop(true)
    amplitude().disableCollection()
    analytics.disableCollection()
  }
}

export const startTrackingAcceptedCookies = (acceptedCookies: Cookies) => {
  const acceptedGoogleAnalytics = acceptedCookies.includes(CookieNameEnum.GOOGLE_ANALYTICS)
  acceptedGoogleAnalytics ? analytics.enableCollection() : analytics.disableCollection()

  const acceptedAppsFlyers = acceptedCookies.includes(CookieNameEnum.APPSFLYER)
  acceptedAppsFlyers ? appsFlyer.stop(false) : appsFlyer.stop(true)

  const acceptedAmplitude = acceptedCookies.includes(CookieNameEnum.AMPLITUDE)
  acceptedAmplitude ? amplitude().enableCollection() : amplitude().disableCollection()
}
