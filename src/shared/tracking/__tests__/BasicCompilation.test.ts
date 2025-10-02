/**
 * Basic test to verify that the new tracking system compiles and works
 */

import { AppLifecycleManager } from '../AppLifecycleManager'
import { TrackingManager } from '../TrackingManager'

describe('New Tracking System - Basic Functionality', () => {
  it('should have proper lifecycle management', () => {
    const info = AppLifecycleManager.getDebugInfo()

    expect(info).toHaveProperty('isInitialized')
    expect(info).toHaveProperty('activePageId')
    expect(info).toHaveProperty('registeredPages')
  })

  it('should have proper tracking management', () => {
    const info = TrackingManager.getDebugInfo()

    expect(info).toHaveProperty('isInitialized')
    expect(info).toHaveProperty('buffersCount')
    expect(info).toHaveProperty('buffers')
  })
})
