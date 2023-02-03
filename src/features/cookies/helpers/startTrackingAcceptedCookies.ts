import { CookieNameEnum } from 'features/cookies/enums'
import { removeGeneratedStorageKey } from 'features/cookies/helpers/removeGeneratedStorageKey'
import { Cookies } from 'features/cookies/types'
import { amplitude } from 'libs/amplitude'
import { campaignTracker } from 'libs/campaign'
import { analytics } from 'libs/firebase/analytics'
import { Batch } from 'libs/react-native-batch'

const cookiesNameEnumUTM =
  CookieNameEnum.TRAFFIC_CAMPAIGN &&
  CookieNameEnum.TRAFFIC_MEDIUM &&
  CookieNameEnum.TRAFFIC_SOURCE &&
  CookieNameEnum.CAMPAIGN_DATE

export const generateUTMKeys = [
  'traffic_campaign',
  'traffic_medium',
  'traffic_source',
  'campaign_date',
]

export const startTrackingAcceptedCookies = (acceptedCookies: Cookies) => {
  const acceptedGoogleAnalytics = acceptedCookies.includes(CookieNameEnum.GOOGLE_ANALYTICS)
  acceptedGoogleAnalytics ? analytics.enableCollection() : analytics.disableCollection()

  const acceptedAppsFlyers = acceptedCookies.includes(CookieNameEnum.APPSFLYER)
  campaignTracker.useInit(acceptedAppsFlyers)
  campaignTracker.startAppsFlyer(acceptedAppsFlyers)

  const acceptedAmplitude = acceptedCookies.includes(CookieNameEnum.AMPLITUDE)
  acceptedAmplitude ? amplitude.enableCollection() : amplitude.disableCollection()

  const acceptedBatch = acceptedCookies.includes(CookieNameEnum.BATCH)
  acceptedBatch ? Batch.optIn() : Batch.optOut()

  const acceptedAlgoliaInsights = acceptedCookies.includes(CookieNameEnum.ALGOLIA_INSIGHTS)
  if (!acceptedAlgoliaInsights) removeGeneratedStorageKey('algoliasearch-client-js')

  const acceptedUTMCampaign = acceptedCookies.includes(cookiesNameEnumUTM)
  if (!acceptedUTMCampaign) {
    generateUTMKeys.forEach((key) => removeGeneratedStorageKey(key))
  }
}
