import { Platform } from 'react-native'

import { env } from 'libs/environment'
import {
  AGENT_TYPE,
  EVENT_PAGE_VIEW_NAME,
  EVENT_PAGE_VIEW_PARAM_KEY,
} from 'libs/firebase/analytics/constants'
import { prepareLogEventParams } from 'libs/firebase/analytics/utils'
import firebaseAnalyticsModule from 'libs/firebase/shims/analytics'

import { version } from '../../../../package.json'

import { AnalyticsProvider } from './types'

const firebaseAnalytics = firebaseAnalyticsModule()
firebaseAnalytics.setAnalyticsCollectionEnabled(false)

export const analyticsProvider: AnalyticsProvider = {
  enableCollection() {
    firebaseAnalytics.setAnalyticsCollectionEnabled(true)
  },
  disableCollection() {
    firebaseAnalytics.setAnalyticsCollectionEnabled(false)
  },
  getAppInstanceId() {
    if (Platform.OS === 'web') return new Promise((resolve) => resolve(null))
    return firebaseAnalytics.getAppInstanceId()
  },
  setDefaultEventParameters(params: Record<string, unknown> | undefined) {
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
    })
  },
  logLogin({ method }) {
    firebaseAnalytics.logEvent('login', { method })
  },
  logEvent(name, params) {
    const newParams = params ? prepareLogEventParams(params) : {}
    newParams['agentType'] = AGENT_TYPE
    if (Platform.OS === 'web') {
      newParams['app_version'] = version
      newParams['app_revision'] = env.COMMIT_HASH
    }
    return firebaseAnalytics.logEvent(name, newParams)
  },
}
