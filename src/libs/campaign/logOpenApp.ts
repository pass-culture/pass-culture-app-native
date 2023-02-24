import { TrackingStatus } from 'react-native-tracking-transparency'

import { campaignTracker, CampaignEvents } from 'libs/campaign'
import { analytics } from 'libs/firebase/analytics'

// Exported for tests only
export const logOpenAppRef = {
  hasLoggedOpenApp: false,
}

export const logOpenApp = async (trackingStatus: TrackingStatus) => {
  if (['authorized', 'unavailable'].includes(trackingStatus) && !logOpenAppRef.hasLoggedOpenApp) {
    logOpenAppRef.hasLoggedOpenApp = true
    const firebasePseudoId = await analytics.getAppInstanceId()
    await campaignTracker.logEvent(CampaignEvents.OPEN_APP, {
      af_firebase_pseudo_id: firebasePseudoId,
    })
  }
}
