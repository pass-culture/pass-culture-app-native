import { firebaseAnalyticsProvider } from 'libs/firebase/analytics/provider'
import { useInit } from 'libs/firebase/analytics/useInit'

export const firebaseAnalytics = {
  enableCollection: firebaseAnalyticsProvider.enableCollection,
  disableCollection: firebaseAnalyticsProvider.disableCollection,
  getAppInstanceId: firebaseAnalyticsProvider.getAppInstanceId,
  logEvent: firebaseAnalyticsProvider.logEvent,
  logScreenView: firebaseAnalyticsProvider.logScreenView,
  setDefaultEventParameters: firebaseAnalyticsProvider.setDefaultEventParameters,
  setUserId: firebaseAnalyticsProvider.setUserId,
  useInit,
}
