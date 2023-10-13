// eslint-disable-next-line no-restricted-imports
import { amplitude } from 'libs/amplitude'
import { logEventAnalytics } from 'libs/analytics/logEventAnalytics'
import { AnalyticsProvider } from 'libs/analytics/types'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'
import { storage } from 'libs/storage'

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
      const locationType = (await storage.readString('location_type')) ?? 'Undefined'
      firebaseAnalytics.logEvent(eventName.firebase, { ...params, locationType })
    }
    if (eventName.amplitude) {
      amplitude.logEvent(eventName.amplitude, params)
    }
  },
  ...logEventAnalytics,
}
