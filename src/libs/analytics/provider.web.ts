import {
  getAnalytics,
  setAnalyticsCollectionEnabled,
  setUserId,
  logEvent,
} from 'firebase/analytics'

import { AgentType } from 'api/gen'
import { prepareLogEventParams } from 'libs/analytics/utils'
import { getFirebaseApp } from 'libs/firebase'
// eslint-disable-next-line no-restricted-imports
import { isDesktopDeviceDetectOnWeb } from 'libs/react-device-detect'

import { AnalyticsProvider } from './types'

const firebaseApp = getFirebaseApp()
const firebaseAnalytics = getAnalytics(firebaseApp)

const AGENT_TYPE = isDesktopDeviceDetectOnWeb
  ? AgentType.browser_computer
  : AgentType.browser_mobile

export const analyticsProvider: AnalyticsProvider = {
  enableCollection() {
    setAnalyticsCollectionEnabled(firebaseAnalytics, true)
  },
  disableCollection() {
    setAnalyticsCollectionEnabled(firebaseAnalytics, false)
  },
  setDefaultEventParameters(_params: Record<string, string> | undefined) {
    // setDefaultEventParameters is not available on web :'(
  },
  setUserId(userId) {
    setUserId(firebaseAnalytics, userId.toString())
  },
  logScreenView(screenName) {
    logEvent(firebaseAnalytics, 'page_view', { page_title: screenName, agentType: AGENT_TYPE })
  },
  logLogin({ method }) {
    logEvent(firebaseAnalytics, 'login', { method, agentType: AGENT_TYPE })
  },
  logEvent(name, params) {
    const newParams = params ? prepareLogEventParams(params) : {}
    newParams['agentType'] = AGENT_TYPE
    return logEvent(firebaseAnalytics, name as string, newParams)
  },
}
