import { useEffect } from 'react'
import appsFlyerDefault from 'react-native-appsflyer'

import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { MonitoringError } from 'libs/errorMonitoring'
import { useTrackingConsent } from 'libs/trackingConsent'

export const appsFlyer = appsFlyerDefault

// We ask for the user's consent on app launch. We defer the sending of events to AppsFlyer,
// depending on the user's response, by the following delay.
// Reference:
// https://support.appsflyer.com/hc/en-us/articles/207032066-iOS-SDK-V6-X-integration-guide-for-developers#integration-33-configuring-app-tracking-transparency-att-support
const TIME_TO_WAIT_FOR_ATT_CONSENT = 60 // in seconds

export const useCampaignTracker = () => {
  // First we ask for the user's consent to access their IDFA information
  useTrackingConsent()

  useEffect(() => {
    if (__DEV__) return

    // Second we initialize the SDK.
    appsFlyer.initSdk(
      {
        devKey: env.APPS_FLYER_DEV_KEY,
        isDebug: env.ENV === 'testing',
        appId: env.IOS_APP_STORE_ID,
        onInstallConversionDataListener: false,
        timeToWaitForATTUserAuthorization: TIME_TO_WAIT_FOR_ATT_CONSENT,
      },
      () => {
        analytics.logCampaignTrackerEnabled()
      },
      (error) => {
        console.error(error)
      }
    )
  }, [])
}

export const getCustomerUniqueId = async (): Promise<string | undefined> => {
  const appsFlyerUserIdPromise: Promise<string | undefined> = new Promise((resolve, reject) => {
    const getAppsFlyerUIDCallback = (error: Error, uid: string) => {
      error && new MonitoringError(error.message, 'ApssFlyer_getUID') && reject(error)
      resolve(uid)
    }
    appsFlyer.getAppsFlyerUID(getAppsFlyerUIDCallback)
  })

  return await appsFlyerUserIdPromise
}
