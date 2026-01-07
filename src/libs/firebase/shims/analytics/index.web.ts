import { getAnalytics as getAnalyticsInstance } from 'firebase/analytics'

import { app } from '../firebase-init'

const analyticsInstance = getAnalyticsInstance(app)
export const getAnalytics = () => analyticsInstance

export { logEvent, setAnalyticsCollectionEnabled, setUserId } from 'firebase/analytics'
