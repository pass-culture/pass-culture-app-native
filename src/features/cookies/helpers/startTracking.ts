// eslint-disable-next-line no-restricted-imports
import { amplitude } from 'libs/amplitude'
import { campaignTracker } from 'libs/campaign'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'
import { Batch } from 'libs/react-native-batch'

const enableTracking = () => {
  amplitude.enableCollection()
  firebaseAnalytics.enableCollection()
  campaignTracker.init(true)
  campaignTracker.startAppsFlyer(true)
  Batch.optIn()
}

const disableTracking = () => {
  amplitude.disableCollection()
  firebaseAnalytics.disableCollection()
  campaignTracker.startAppsFlyer(false)
  Batch.optOut()
}

export const startTracking = (enabled: boolean) => {
  enabled ? enableTracking() : disableTracking()
}
