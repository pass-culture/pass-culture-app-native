import { Platform } from 'react-native'

import { prepareLogEventParams } from 'libs/analytics'
import { env } from 'libs/environment'
import {
  AGENT_TYPE,
  EVENT_PAGE_VIEW_NAME,
  EVENT_PAGE_VIEW_PARAM_KEY,
} from 'libs/firebase/analytics/constants'
import firebaseAnalyticsModule from 'libs/firebase/shims/analytics'

import { version } from '../../../../package.json'

import { AnalyticsProvider } from './types'

const firebaseAnalytics = firebaseAnalyticsModule()
firebaseAnalytics.setAnalyticsCollectionEnabled(false)

export const firebaseAnalyticsProvider: AnalyticsProvider = {
  async enableCollection() {
    firebaseAnalytics.setAnalyticsCollectionEnabled(true)
  },
  async disableCollection() {
    firebaseAnalytics.setAnalyticsCollectionEnabled(false)
  },
  async getAppInstanceId() {
    if (Platform.OS === 'web') return Promise.resolve(null)
    return firebaseAnalytics.getAppInstanceId()
  },
  async setDefaultEventParameters(params: Record<string, unknown> | undefined) {
    // only apply on native devices, does not exist on the Web
    if (Platform.OS !== 'web') {
      firebaseAnalytics.setDefaultEventParameters(params)
    }
  },
  async setUserId(userId) {
    firebaseAnalytics.setUserId(userId.toString())
  },
  async logScreenView(screenName) {
    firebaseAnalytics.logEvent(EVENT_PAGE_VIEW_NAME, {
      [EVENT_PAGE_VIEW_PARAM_KEY]: screenName,
      screen_class: screenName,
    })
  },
  async logLogin({ method }) {
    firebaseAnalytics.logEvent('login', { method })
  },
  async logEvent(name, params) {
    const newParams = params ? prepareLogEventParams(params) : {}
    newParams['agentType'] = AGENT_TYPE
    if (Platform.OS === 'web') {
      newParams['app_version'] = version
      newParams['app_revision'] = env.COMMIT_HASH
    }
    return firebaseAnalytics.logEvent(name, newParams)
  },
}
