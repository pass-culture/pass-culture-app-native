import { Platform } from 'react-native'

// eslint-disable-next-line no-restricted-imports
import { amplitude } from 'libs/amplitude'
import { logEventAnalytics } from 'libs/analytics/logEventAnalytics'
import { AnalyticsProvider } from 'libs/analytics/types'
import { getIsMaestro } from 'libs/e2e/getIsMaestro'
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
    const locationType = (await storage.readString('location_type')) ?? 'undefined'
    firebaseAnalytics.logScreenView(screenName, locationType)
  },
  logEvent: async (eventName, params) => {
    if (eventName.firebase) {
      const locationType = (await storage.readString('location_type')) ?? 'undefined'
      firebaseAnalytics.logEvent(eventName.firebase, { ...params, locationType })
    }
    if (eventName.amplitude) {
      amplitude.logEvent(eventName.amplitude, params)
    }
    if (await getIsMaestro()) {
      const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost' // NOSONAR(typescript:S5332) maestro is run locally, we don't use HTTPS
      const MOCK_ANALYTICS_SERVER_URL = `http://${host}:4001` // NOSONAR(typescript:S5332) maestro is run locally, we don't use HTTPS
      await fetch(MOCK_ANALYTICS_SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analyticsKey: eventName.firebase }),
      })
    }
  },
  setEventLocationType: async () => {
    const locationType = (await storage.readString('location_type')) ?? 'undefined'
    firebaseAnalytics.setDefaultEventParameters({ locationType })
  },
  ...logEventAnalytics,
}
