// eslint-disable-next-line no-restricted-imports
import { campaignTracker } from 'libs/campaign'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { Batch } from 'libs/react-native-batch'

const enableTracking = () => {
  firebaseAnalytics.enableCollection()
  campaignTracker.init(true)
  campaignTracker.startAppsFlyer(true)
  Batch.optIn()
}

const disableTracking = () => {
  firebaseAnalytics.disableCollection()
  campaignTracker.startAppsFlyer(false)
  Batch.optOut()
}

export const startTracking = (enabled: boolean) => {
  enabled ? enableTracking() : disableTracking()
}
