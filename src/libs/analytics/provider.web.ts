import { AgentType } from 'api/gen'
import { getFirebaseApp } from 'libs/firebase'
// eslint-disable-next-line no-restricted-imports
import { isDesktopDeviceDetectOnWeb } from 'libs/react-device-detect'

import { AnalyticsProvider } from './types'

const firebaseApp = getFirebaseApp()
const firebaseAnalytics = firebaseApp.analytics()

export const analyticsProvider: AnalyticsProvider = {
  enableCollection() {
    firebaseAnalytics.setAnalyticsCollectionEnabled(true)
  },
  disableCollection() {
    firebaseAnalytics.setAnalyticsCollectionEnabled(false)
  },
  setDefaultEventParameters(_params: Record<string, string> | undefined) {
    // setDefaultEventParameters is not available on web :'(
  },
  setUserId(userId) {
    firebaseAnalytics.setUserId(userId.toString())
  },
  logScreenView(screenName) {
    firebaseAnalytics.logEvent('page_view', { page_title: screenName })
  },
  logLogin({ method }) {
    firebaseAnalytics.logEvent('login', { method })
  },
  logEvent(name, params) {
    if (!params) return firebaseAnalytics.logEvent(name as string)
    // We don't send integers to firebase because they will be cast into int_value, float_value,
    // or double_value in BigQuery depending on its value. To facilitate the work of the team,
    // we just cast it to string.
    const newParams = Object.keys(params).reduce((acc: Record<string, unknown>, key) => {
      acc[key] = typeof params[key] === 'number' ? (params[key] as number).toString() : params[key]
      return acc
    }, {})
    newParams['agentType'] = isDesktopDeviceDetectOnWeb
      ? AgentType.browser_computer
      : AgentType.browser_mobile
    return firebaseAnalytics.logEvent(name as string, newParams)
  },
}
