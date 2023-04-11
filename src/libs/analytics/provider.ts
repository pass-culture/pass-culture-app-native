import { amplitude } from 'libs/amplitude'
import { logEventAnalytics } from 'libs/analytics/logEventAnalytics'
import { AnalyticsProvider } from 'libs/analytics/types'
import { analytics as firebaseAnalytics } from 'libs/firebase/analytics'

export const analytics: AnalyticsProvider = {
  enableCollection: () => {
    firebaseAnalytics.enableCollection()
    amplitude.enableCollection()
  },
  disableCollection: () => {
    firebaseAnalytics.disableCollection()
    amplitude.disableCollection()
  },
  logScreenView: (screenName) => {
    firebaseAnalytics.logScreenView(screenName)
  },
  logEvent: (eventName, params) => {
    eventName.firebase && firebaseAnalytics.logEvent(eventName.firebase, params)
    eventName.amplitude && amplitude.logEvent(eventName.amplitude, params)
  },
  ...logEventAnalytics,
}
