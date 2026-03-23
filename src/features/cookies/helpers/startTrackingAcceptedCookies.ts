import { CookieNameEnum } from 'features/cookies/enums'
import { removeGeneratedStorageKey } from 'features/cookies/helpers/removeGeneratedStorageKey'
import { Cookies } from 'features/cookies/types'
import { Adjust } from 'libs/adjust/adjust'
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { Batch, BatchPush } from 'libs/react-native-batch'

const cookiesNameEnumUTM =
  CookieNameEnum.TRAFFIC_CAMPAIGN &&
  CookieNameEnum.TRAFFIC_MEDIUM &&
  CookieNameEnum.TRAFFIC_SOURCE &&
  CookieNameEnum.CAMPAIGN_DATE

export const generateUTMKeys = [
  'traffic_campaign',
  'traffic_gen',
  'traffic_medium',
  'traffic_source',
  'campaign_date',
]

export const startTrackingAcceptedCookies = (
  acceptedCookies: Cookies,
  calledBecauseOfNewConsents: boolean
) => {
  const acceptedGoogleAnalytics = acceptedCookies.includes(CookieNameEnum.GOOGLE_ANALYTICS)
  acceptedGoogleAnalytics
    ? firebaseAnalytics.enableCollection()
    : firebaseAnalytics.disableCollection()

  const acceptedAdjust = acceptedCookies.includes(CookieNameEnum.ADJUST)
  acceptedAdjust ? Adjust.initOrEnable(calledBecauseOfNewConsents) : Adjust.disable()

  const acceptedAlgoliaInsights = acceptedCookies.includes(CookieNameEnum.ALGOLIA_INSIGHTS)
  if (!acceptedAlgoliaInsights) removeGeneratedStorageKey('algoliasearch-client-js')

  const acceptedUTMCampaign = acceptedCookies.includes(cookiesNameEnumUTM)
  if (!acceptedUTMCampaign) {
    generateUTMKeys.forEach((key) => removeGeneratedStorageKey(key))
  }

  const acceptedBatch = acceptedCookies.includes(CookieNameEnum.BATCH)
  if (acceptedBatch) {
    Batch.optIn()
    if (calledBecauseOfNewConsents) {
      BatchPush.requestNotificationAuthorization() // For iOS and Android 13
    }
  } else {
    Batch.optOut()
  }
}
