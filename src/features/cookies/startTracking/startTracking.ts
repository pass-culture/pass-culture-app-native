import { amplitude } from 'libs/amplitude'
import { campaignTracker } from 'libs/campaign'
import { analytics } from 'libs/firebase/analytics'

export const startTracking = (enabled: boolean) => {
  if (enabled) {
    amplitude().enableCollection()
    analytics.enableCollection()
    campaignTracker.startAppsFlyer(true)
  } else {
    amplitude().disableCollection()
    analytics.disableCollection()
    campaignTracker.startAppsFlyer(false)
  }
}
