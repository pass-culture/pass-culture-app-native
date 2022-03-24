import { AgentType } from 'api/gen'
import { prepareLogEventParams } from 'libs/analytics/utils'
import { getFirebaseApp } from 'libs/firebase/getFirebaseApp'
// eslint-disable-next-line no-restricted-imports
import { isDesktopDeviceDetectOnWeb } from 'libs/react-device-detect'

import { AnalyticsProvider } from './types'

const firebaseApp = getFirebaseApp()
const firebaseAnalytics = firebaseApp.analytics()

const AGENT_TYPE = isDesktopDeviceDetectOnWeb
  ? AgentType.browser_computer
  : AgentType.browser_mobile

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
    firebaseAnalytics.logEvent('page_view', { page_title: screenName, agentType: AGENT_TYPE })
  },
  logLogin({ method }) {
    firebaseAnalytics.logEvent('login', { method, agentType: AGENT_TYPE })
  },
  logEvent(name, params) {
    const newParams = params ? prepareLogEventParams(params) : {}
    newParams['agentType'] = AGENT_TYPE
    return firebaseAnalytics.logEvent(name as string, newParams)
  },
}
