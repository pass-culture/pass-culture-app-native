import { getAnalytics as getAnalyticsInstance } from 'firebase/analytics'

import initializeApp from '../firebase-init'

const app = initializeApp()

const analyticsInstance = getAnalyticsInstance(app)
export const getAnalytics = () => analyticsInstance

export { logEvent, setAnalyticsCollectionEnabled, setUserId } from 'firebase/analytics'
