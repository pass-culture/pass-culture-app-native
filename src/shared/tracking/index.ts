/**
 * 🎯 New Tracking System - Main Export
 *
 * Single entry point for the new unified tracking system
 * that replaces the previous fragile architecture.
 */

// Core Components
export { TrackingLogger } from './TrackingLogger'
export { AppLifecycleManager } from './AppLifecycleManager'
export { TrackingManager } from './TrackingManager'

// Hook Principal
export { usePageTracking, createViewableItemsHandler } from './usePageTracking'
export type { UsePageTrackingConfig, TrackingHandlers } from './usePageTracking'

// Types
export type { TrackingData, PageTrackingConfig } from './TrackingManager'
export type { LogContext } from './TrackingLogger'

// Initialize the system
import { TrackingManager } from './TrackingManager'

// Auto-initialize the tracking system
TrackingManager.initialize()

// Debug logs only in development
if (__DEV__) {
  // eslint-disable-next-line no-console
  console.log('🚀 New tracking system initialized')
  // eslint-disable-next-line no-console
  console.log('🛠️ Debug interface available: __TRACKING__')
  // eslint-disable-next-line no-console
  console.log('📊 Pre-analytics detailed logs: PRE_ANALYTICS_SEND_DETAIL')
}
