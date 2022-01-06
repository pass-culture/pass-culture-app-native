import { AgentType } from 'api/gen'
import { prepareLogEventParams } from 'libs/analytics/utils'
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
    const newParams = params ? prepareLogEventParams(params) : {}
    newParams['agentType'] = isDesktopDeviceDetectOnWeb
      ? AgentType.browser_computer
      : AgentType.browser_mobile
    return firebaseAnalytics.logEvent(name as string, newParams)
  },
}
