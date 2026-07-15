import { analyticsDebuggerActions } from 'features/analyticsDebugger/store/analyticsDebuggerStore'
// eslint-disable-next-line no-restricted-imports
import { isDuplicateEvent } from 'libs/analytics/eventDeduplication'
// eslint-disable-next-line no-restricted-imports
import { logEventAnalytics } from 'libs/analytics/logEventAnalytics'
import { AnalyticsProvider } from 'libs/analytics/types'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { locationSelectors } from 'libs/locationV2/location.store'

export const analytics: AnalyticsProvider = {
  enableCollection: async () => {
    await firebaseAnalytics.enableCollection()
  },
  disableCollection: async () => {
    await firebaseAnalytics.disableCollection()
  },

  logScreenView: async (screenName) => {
    if (isDuplicateEvent('screen_view', { screenName })) return
    const locationType = locationSelectors.selectLocationType()
    await firebaseAnalytics.logScreenView(screenName, locationType)
  },
  logEvent: async (eventName, params) => {
    if (eventName.firebase) {
      if (isDuplicateEvent(eventName.firebase, params)) return
      analyticsDebuggerActions.captureEvent(eventName.firebase, params)
      const locationType = locationSelectors.selectLocationType()
      await firebaseAnalytics.logEvent(eventName.firebase, { ...params, locationType })
    }
  },
  ...logEventAnalytics,
}
