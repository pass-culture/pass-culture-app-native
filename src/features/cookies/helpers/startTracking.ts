// eslint-disable-next-line no-restricted-imports
import { Adjust } from 'libs/adjust/adjust'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { Batch } from 'libs/react-native-batch'

const enableTracking = () => {
  firebaseAnalytics.enableCollection()
  Adjust.initOrEnable()
  Batch.optIn()
}

const disableTracking = () => {
  firebaseAnalytics.disableCollection()
  Adjust.disable()
  Batch.optOut()
}

export const startTracking = (enabled: boolean) => {
  enabled ? enableTracking() : disableTracking()
}
