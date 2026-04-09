// eslint-disable-next-line no-restricted-imports
import { isDuplicateEvent } from 'libs/analytics/eventDeduplication'
// eslint-disable-next-line no-restricted-imports
import { logEventAnalytics } from 'libs/analytics/logEventAnalytics'
import { AnalyticsProvider } from 'libs/analytics/types'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { storage } from 'libs/storage'

export const analytics: AnalyticsProvider = {
  enableCollection: async () => {
    await firebaseAnalytics.enableCollection()
  },
  disableCollection: async () => {
    await firebaseAnalytics.disableCollection()
  },

  logScreenView: async (screenName) => {
    if (isDuplicateEvent('screen_view', { screenName })) return
    const locationType = (await storage.readString('location_type')) ?? 'undefined'
    await firebaseAnalytics.logScreenView(screenName, locationType)
  },
  logEvent: async (eventName, params) => {
    if (eventName.firebase) {
      if (isDuplicateEvent(eventName.firebase, params)) return
      const locationType = (await storage.readString('location_type')) ?? 'undefined'
      await firebaseAnalytics.logEvent(eventName.firebase, { ...params, locationType })
    }
  },
  setEventLocationType: async () => {
    const locationType = (await storage.readString('location_type')) ?? 'undefined'
    await firebaseAnalytics.setDefaultEventParameters({ locationType })
  },
  ...logEventAnalytics,
}
