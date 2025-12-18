import {
  getAnalytics,
  logEvent,
  setAnalyticsCollectionEnabled,
  setUserId,
} from 'firebase/analytics'

import initializeApp from '../firebase-init'

const app = initializeApp()

const analyticsInstance = getAnalytics(app)
const getAnalyticsInstance = () => analyticsInstance

export { getAnalyticsInstance as getAnalytics, logEvent, setAnalyticsCollectionEnabled, setUserId }
