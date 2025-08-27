// eslint-disable-next-line no-restricted-imports
import { logEventAnalytics } from 'libs/analytics/logEventAnalytics'
import { AnalyticsProvider } from 'libs/analytics/types'
import { getIsMaestro } from 'libs/e2e/getIsMaestro'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { storage } from 'libs/storage'

export const analytics: AnalyticsProvider = {
  enableCollection: async () => {
    firebaseAnalytics.enableCollection()
  },
  disableCollection: async () => {
    firebaseAnalytics.disableCollection()
  },

  logScreenView: async (screenName) => {
    const locationType = (await storage.readString('location_type')) ?? 'undefined'
    firebaseAnalytics.logScreenView(screenName, locationType)
  },
  logEvent: async (eventName, params) => {
    console.log('Logging event:', { eventName, params }) // Debug log
    if (eventName.firebase) {
      const locationType = (await storage.readString('location_type')) ?? 'undefined'
      firebaseAnalytics.logEvent(eventName.firebase, { ...params, locationType })
    }
    if (await getIsMaestro()) {
      const MOCK_ANALYTICS_SERVER_URL = 'http://localhost:4001' // NOSONAR(typescript:S5332) maestro is run locally, we don't use HTTPS
      await fetch(MOCK_ANALYTICS_SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analyticsKey: eventName.firebase, params }),
      })
    }
  },
  setEventLocationType: async () => {
    const locationType = (await storage.readString('location_type')) ?? 'undefined'
    firebaseAnalytics.setDefaultEventParameters({ locationType })
  },
  ...logEventAnalytics,
}
