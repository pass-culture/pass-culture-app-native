import appsFlyer from 'react-native-appsflyer'
import { getTrackingStatus } from 'react-native-tracking-transparency'

import { analytics } from 'libs/analytics'
import { isAppsFlyerTrackingEnabled } from 'libs/campaign/isAppsFlyerTrackingEnabled'
import { logOpenApp } from 'libs/campaign/logOpenApp'
import { env } from 'libs/environment'
import { captureMonitoringError } from 'libs/monitoring'
import { requestIDFATrackingConsent } from 'libs/trackingConsent/useTrackingConsent'

import { CampaignEvents } from './events'
import { CampaignTracker } from './types'

// We ask for the user's consent on app launch. We defer the sending of events to AppsFlyer,
// depending on the user's response, by the following delay.
// Reference:
// https://support.appsflyer.com/hc/en-us/articles/207032066-iOS-SDK-V6-X-integration-guide-for-developers#integration-33-configuring-app-tracking-transparency-att-support
const TIME_TO_WAIT_FOR_ATT_CONSENT = 60 // in seconds

function init(hasAcceptedMarketingCookie: boolean) {
  // We do not init appsflyer or display ATT if user refuses marketing cookies
  if (!hasAcceptedMarketingCookie) return

  // First we ask for the user's consent to access their IDFA information
  requestIDFATrackingConsent()

  if (__DEV__) return

  // Second we initialize the SDK.
  appsFlyer.initSdk(
    {
      devKey: env.APPS_FLYER_DEV_PUBLIC_KEY,
      isDebug: env.ENV === 'testing',
      appId: env.IOS_APP_STORE_ID,
      onInstallConversionDataListener: false,
      timeToWaitForATTUserAuthorization: TIME_TO_WAIT_FOR_ATT_CONSENT,
    },
    () => {
      analytics.logCampaignTrackerEnabled()
      getTrackingStatus().then(logOpenApp)
    },
    (error) => {
      console.error(error)
    }
  )
}

async function logEvent(event: CampaignEvents, params: Record<string, unknown>): Promise<void> {
  if (__DEV__) return

  const canLogEvent = await isAppsFlyerTrackingEnabled()
  if (canLogEvent) {
    try {
      await appsFlyer.logEvent(event, params)
    } catch (error) {
      // Intentionally left empty to ignore errors
    }
  }
}

async function getUserId(): Promise<string | undefined> {
  if (__DEV__) return 'devAppsFlyerUserId'
  const appsFlyerUserIdPromise: Promise<string | undefined> = new Promise((resolve, reject) => {
    const getAppsFlyerUIDCallback = (error: Error, uid: string) => {
      if (error) {
        captureMonitoringError(error.message, 'AppsFlyer_getUID')
        reject(error)
      }
      resolve(uid)
    }
    appsFlyer.getAppsFlyerUID(getAppsFlyerUIDCallback)
  })
  return appsFlyerUserIdPromise
}

function startAppsFlyer(enabled: boolean) {
  return appsFlyer.stop(!enabled)
}

export const campaignTracker: CampaignTracker = {
  logEvent,
  getUserId,
  init,
  startAppsFlyer,
}
