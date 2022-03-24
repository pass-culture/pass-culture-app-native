import { AGENT_TYPE } from 'libs/analytics/constants'
import { prepareLogEventParams } from 'libs/analytics/utils'
import { getFirebaseApp } from 'libs/firebaseOld/getFirebaseApp'

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
