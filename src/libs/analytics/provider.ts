import firebaseAnalyticsModule from '@react-native-firebase/analytics'

import { AnalyticsProvider } from './types'

const firebaseAnalytics = firebaseAnalyticsModule()

export const analyticsProvider: AnalyticsProvider = {
  enableCollection() {
    firebaseAnalytics.setAnalyticsCollectionEnabled(true)
  },
  disableCollection() {
    firebaseAnalytics.setAnalyticsCollectionEnabled(false)
  },
  setUserId(userId) {
    firebaseAnalytics.setUserId(userId.toString())
  },
  async logScreenView(screenName) {
    await firebaseAnalytics.logScreenView({ screen_name: screenName, screen_class: screenName })
  },
  logLogin({ method }) {
    firebaseAnalytics.logLogin({ method })
  },
  logEvent(name, params) {
    if (!params) return firebaseAnalytics.logEvent(name)
    // We don't send integers to firebase because they will be cast into int_value, float_value,
    // or double_value in BigQuery depending on its value. To facilitate the work of the team,
    // we just cast it to string.
    const newParams = Object.keys(params).reduce((acc: Record<string, unknown>, key) => {
      acc[key] = typeof params[key] === 'number' ? (params[key] as number).toString() : params[key]
      return acc
    }, {})
    return firebaseAnalytics.logEvent(name, newParams)
  },
}
