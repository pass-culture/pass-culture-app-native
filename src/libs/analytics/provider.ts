import firebaseAnalyticsModule from '@react-native-firebase/analytics'

import { AgentType } from 'api/gen'
import { prepareLogEventParams } from 'libs/analytics/utils'

import { AnalyticsProvider } from './types'

const firebaseAnalytics = firebaseAnalyticsModule()

const AGENT_TYPE = AgentType.agent_mobile

export const analyticsProvider: AnalyticsProvider = {
  enableCollection() {
    firebaseAnalytics.setAnalyticsCollectionEnabled(true)
  },
  disableCollection() {
    firebaseAnalytics.setAnalyticsCollectionEnabled(false)
  },
  setDefaultEventParameters(params: Record<string, string> | undefined) {
    firebaseAnalytics.setDefaultEventParameters(params)
  },
  setUserId(userId) {
    firebaseAnalytics.setUserId(userId.toString())
  },
  logScreenView(screenName) {
    firebaseAnalytics.logEvent('screen_view', {
      screen_name: screenName,
      screen_class: screenName,
      agentType: AGENT_TYPE,
    })
  },
  logLogin({ method }) {
    firebaseAnalytics.logEvent('login', { method, agentType: AGENT_TYPE })
  },
  logEvent(name, params) {
    const newParams = params ? prepareLogEventParams(params) : {}
    newParams['agentType'] = AGENT_TYPE
    return firebaseAnalytics.logEvent(name, newParams)
  },
}
