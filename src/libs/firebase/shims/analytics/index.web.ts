import {
  getAnalytics,
  logEvent,
  setAnalyticsCollectionEnabled,
  setUserId,
} from 'firebase/analytics'

import initializeApp from '../firebase-init'

// 1. Initialize App
const app = initializeApp()

// 2. Initialize Analytics
// Note: We create a getter to match the Native Shim's behavior
const analyticsInstance = getAnalytics(app)
const getAnalyticsInstance = () => analyticsInstance

export { getAnalyticsInstance as getAnalytics, logEvent, setAnalyticsCollectionEnabled, setUserId }
