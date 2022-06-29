import { Platform } from 'react-native'

import {
  AGENT_TYPE,
  EVENT_PAGE_VIEW_NAME,
  EVENT_PAGE_VIEW_PARAM_KEY,
} from 'libs/firebase/analytics/constants'
import { prepareLogEventParams } from 'libs/firebase/analytics/utils'
import firebaseAnalyticsModule from 'libs/firebase/shims/analytics'

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
    // only apply on native devices, does not exist on the Web
    if (Platform.OS !== 'web') {
      firebaseAnalytics.setDefaultEventParameters(params)
    }
  },
  setUserId(userId) {
    firebaseAnalytics.setUserId(userId.toString())
  },
  logScreenView(screenName) {
    firebaseAnalytics.logEvent(EVENT_PAGE_VIEW_NAME, {
      [EVENT_PAGE_VIEW_PARAM_KEY]: screenName,
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
