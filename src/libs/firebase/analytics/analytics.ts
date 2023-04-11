import { logEventAnalytics } from 'libs/analytics/logEventAnalytics'
import { firebaseAnalyticsProvider } from 'libs/firebase/analytics/provider'
import { LoginRoutineMethod } from 'libs/firebase/analytics/types'
import { useInit } from 'libs/firebase/analytics/useInit'

export const analytics = {
  enableCollection: firebaseAnalyticsProvider.enableCollection,
  disableCollection: firebaseAnalyticsProvider.disableCollection,
  getAppInstanceId: firebaseAnalyticsProvider.getAppInstanceId,
  logEvent: firebaseAnalyticsProvider.logEvent,
  logLogin({ method }: { method: LoginRoutineMethod }) {
    firebaseAnalyticsProvider.logLogin({ method })
  },
  logScreenView: firebaseAnalyticsProvider.logScreenView,
  setDefaultEventParameters: firebaseAnalyticsProvider.setDefaultEventParameters,
  setUserId: firebaseAnalyticsProvider.setUserId,
  useInit,
  ...logEventAnalytics,
}
