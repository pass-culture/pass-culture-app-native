import { amplitude } from 'libs/amplitude'
import { logEventAnalytics } from 'libs/analytics/logEventAnalytics'
import { AnalyticsProvider } from 'libs/analytics/types'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'

export const analytics: AnalyticsProvider = {
  enableCollection: async () => {
    firebaseAnalytics.enableCollection()
    amplitude.enableCollection()
  },
  disableCollection: async () => {
    firebaseAnalytics.disableCollection()
    amplitude.disableCollection()
  },
  logScreenView: async (screenName) => {
    firebaseAnalytics.logScreenView(screenName)
  },
  logEvent: async (eventName, params) => {
    if (eventName.firebase) {
      firebaseAnalytics.logEvent(eventName.firebase, params)
    }
    if (eventName.amplitude) {
      amplitude.logEvent(eventName.amplitude, params)
    }
  },
  ...logEventAnalytics,
}
