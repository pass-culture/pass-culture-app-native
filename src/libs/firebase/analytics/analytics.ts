import { firebaseAnalyticsProvider } from 'libs/firebase/analytics/provider'
import { useInit } from 'libs/firebase/analytics/useInit'

export const firebaseAnalytics = {
  ...firebaseAnalyticsProvider,
  useInit,
}
