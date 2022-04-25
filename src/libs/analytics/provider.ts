// eslint-disable-next-line no-restricted-imports
import { setAnalyticsCollectionEnabled, setUserId, logEvent } from 'firebase/analytics'

import {
  AGENT_TYPE,
  EVENT_PAGE_VIEW_NAME,
  EVENT_PAGE_VIEW_PARAM_KEY,
} from 'libs/analytics/constants'
import { prepareLogEventParams } from 'libs/analytics/utils'
import firebaseAnalyticsModule from 'libs/firebase/analytics'

import { AnalyticsProvider } from './types'

const firebaseAnalytics = firebaseAnalyticsModule()

export const analyticsProvider: AnalyticsProvider = {
  enableCollection() {
    // @ts-ignore TODO(LucasBeneston): Fix typing after update @react-native-firebase/app
    setAnalyticsCollectionEnabled(firebaseAnalytics, true)
  },
  disableCollection() {
    // @ts-ignore TODO(LucasBeneston): Fix typing after update @react-native-firebase/app
    setAnalyticsCollectionEnabled(firebaseAnalytics, false)
  },
  setDefaultEventParameters(params: Record<string, string> | undefined) {
    // only apply on native devices, mocked on the Web
    // @ts-ignore TODO(LucasBeneston): Fix after update @react-native-firebase/app
    // setDefaultEventParameters(firebaseAnalytics, params)
    firebaseAnalytics.setDefaultEventParameters(params)
  },
  setUserId(userId) {
    // @ts-ignore TODO(LucasBeneston): Fix typing after update @react-native-firebase/app
    setUserId(firebaseAnalytics, userId.toString())
  },
  logScreenView(screenName) {
    // @ts-ignore TODO(LucasBeneston): Fix typing after update @react-native-firebase/app
    logEvent(firebaseAnalytics, EVENT_PAGE_VIEW_NAME, {
      [EVENT_PAGE_VIEW_PARAM_KEY]: screenName,
      screen_class: screenName,
      agentType: AGENT_TYPE,
    })
  },
  logLogin({ method }) {
    // @ts-ignore TODO(LucasBeneston): Fix typing after update @react-native-firebase/app
    logEvent(firebaseAnalytics, 'login', { method, agentType: AGENT_TYPE })
  },

  logEvent(name, params) {
    const newParams = params ? prepareLogEventParams(params) : {}
    newParams['agentType'] = AGENT_TYPE
    // @ts-ignore TODO(LucasBeneston): Fix typing after update @react-native-firebase/app
    return logEvent(firebaseAnalytics, name, newParams)
  },
}
