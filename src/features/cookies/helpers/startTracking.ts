// eslint-disable-next-line no-restricted-imports
import { amplitude } from 'libs/amplitude'
import { campaignTracker } from 'libs/campaign'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'
import { Batch } from 'libs/react-native-batch'

export const startTracking = (enabled: boolean) => {
  if (enabled) {
    amplitude.enableCollection()
    firebaseAnalytics.enableCollection()
    campaignTracker.init(true)
    campaignTracker.startAppsFlyer(true)
    Batch.optIn()
  } else {
    amplitude.disableCollection()
    firebaseAnalytics.disableCollection()
    campaignTracker.startAppsFlyer(false)
    Batch.optOut()
  }
}
