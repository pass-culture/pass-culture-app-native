import appsFlyer from 'react-native-appsflyer'

import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'

export const appsFlyerClient = {
  init: ({ enabled }: { enabled: boolean }) => {
    if (!enabled) return

    appsFlyer.initSdk(
      {
        devKey: env.APPS_FLYER_DEV_KEY,
        isDebug: true, // set to true if you want to see data in the logs
        appId: env.IOS_APP_STORE_ID,
        onInstallConversionDataListener: false,
      },
      () => {
        analytics.logCampaignTrackerEnabled()
      },
      (error) => {
        console.error(error)
      }
    )
  },
}
