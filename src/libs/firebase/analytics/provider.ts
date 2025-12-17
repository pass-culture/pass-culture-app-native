import { Platform } from 'react-native'

import { prepareLogEventParams } from 'libs/analytics'
import { env } from 'libs/environment/env'
import {
  AGENT_TYPE,
  EVENT_PAGE_VIEW_NAME,
  EVENT_PAGE_VIEW_PARAM_KEY,
} from 'libs/firebase/analytics/constants'
// 1. Import named functions
import {
  getAnalytics,
  logEvent,
  setAnalyticsCollectionEnabled,
  setUserId,
} from 'libs/firebase/shims/analytics'
import { getAppVersion } from 'libs/packageJson'

import { AnalyticsProvider } from './types'

// 2. Get Instance
const firebaseAnalytics = getAnalytics()

// 3. Use Functional Syntax
setAnalyticsCollectionEnabled(firebaseAnalytics, false)

export const firebaseAnalyticsProvider: AnalyticsProvider = {
  async enableCollection() {
    setAnalyticsCollectionEnabled(firebaseAnalytics, true)
  },
  async disableCollection() {
    setAnalyticsCollectionEnabled(firebaseAnalytics, false)
  },
  async getAppInstanceId() {
    if (Platform.OS === 'web') return Promise.resolve(null)
    // The native instance is an object, so we can still access native-only methods
    // directly if we haven't shimmed them.
    return firebaseAnalytics.getAppInstanceId()
  },
  async setDefaultEventParameters(params: Record<string, unknown> | undefined) {
    // only apply on native devices, does not exist on the Web
    if (Platform.OS !== 'web') {
      firebaseAnalytics.setDefaultEventParameters(params)
    }
  },
  async setUserId(userId) {
    setUserId(firebaseAnalytics, userId.toString())
  },
  async logScreenView(screenName, locationType) {
    // @ts-expect-error Firebase has overly strict event name types

    logEvent(firebaseAnalytics, EVENT_PAGE_VIEW_NAME, {
      [EVENT_PAGE_VIEW_PARAM_KEY]: screenName,
      screen_class: screenName,
      locationType,
    })
  },
  async logEvent(name, params) {
    const newParams = params ? prepareLogEventParams(params) : {}
    newParams['agentType'] = AGENT_TYPE
    if (Platform.OS === 'web') {
      newParams['app_version'] = getAppVersion()
      newParams['app_revision'] = env.COMMIT_HASH
    }
    // @ts-expect-error Firebase has overly strict event name types
    return logEvent(firebaseAnalytics, name, newParams)
  },
}
