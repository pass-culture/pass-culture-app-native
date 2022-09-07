import { amplitude } from 'libs/amplitude'
import { campaignTracker } from 'libs/campaign'
import { analytics } from 'libs/firebase/analytics'
import { Batch } from 'libs/react-native-batch'

export const startTracking = (enabled: boolean) => {
  if (enabled) {
    amplitude().enableCollection()
    analytics.enableCollection()
    campaignTracker.startAppsFlyer(true)
    Batch.optIn()
  } else {
    amplitude().disableCollection()
    analytics.disableCollection()
    campaignTracker.startAppsFlyer(false)
    Batch.optOut()
  }
}
