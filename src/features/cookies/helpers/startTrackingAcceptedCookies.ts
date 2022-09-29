import { CookieNameEnum } from 'features/cookies/enums'
import { Cookies } from 'features/cookies/types'
import { amplitude } from 'libs/amplitude'
import { campaignTracker } from 'libs/campaign'
import { analytics } from 'libs/firebase/analytics'
import { Batch } from 'libs/react-native-batch'

export const startTrackingAcceptedCookies = (acceptedCookies: Cookies) => {
  const acceptedGoogleAnalytics = acceptedCookies.includes(CookieNameEnum.GOOGLE_ANALYTICS)
  acceptedGoogleAnalytics ? analytics.enableCollection() : analytics.disableCollection()

  const acceptedAppsFlyers = acceptedCookies.includes(CookieNameEnum.APPSFLYER)
  campaignTracker.startAppsFlyer(acceptedAppsFlyers)

  const acceptedAmplitude = acceptedCookies.includes(CookieNameEnum.AMPLITUDE)
  acceptedAmplitude ? amplitude.enableCollection() : amplitude.disableCollection()

  const acceptedBatch = acceptedCookies.includes(CookieNameEnum.BATCH)
  acceptedBatch ? Batch.optIn() : Batch.optOut()
}
