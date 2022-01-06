import firebaseAnalyticsModule from '@react-native-firebase/analytics'

import { AgentType } from 'api/gen'
import { prepareLogEventParams } from 'libs/analytics/utils'

import { AnalyticsProvider } from './types'

const firebaseAnalytics = firebaseAnalyticsModule()

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
  async logScreenView(screenName) {
    await firebaseAnalytics.logScreenView({ screen_name: screenName, screen_class: screenName })
  },
  logLogin({ method }) {
    firebaseAnalytics.logLogin({ method })
  },
  logEvent(name, params) {
    const newParams = params ? prepareLogEventParams(params) : {}
    newParams['agentType'] = AgentType.agent_mobile
    return firebaseAnalytics.logEvent(name, newParams)
  },
}
