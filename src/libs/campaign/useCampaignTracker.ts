import { useEffect } from 'react'

import { appsFlyerClient } from 'libs/campaign/client'
import { useTrackingConsent } from 'libs/trackingConsent'

export const useCampaignTracker = () => {
  const consentTracking = useTrackingConsent()

  useEffect(() => {
    appsFlyerClient.init({ enabled: !__DEV__ && consentTracking })
  }, [consentTracking])
}
