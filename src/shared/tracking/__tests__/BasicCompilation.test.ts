/**
 * Basic test to verify that the new tracking system compiles and works
 */

import { AppLifecycleManager } from '../AppLifecycleManager'
import { TrackingLogger } from '../TrackingLogger'
import { TrackingManager } from '../TrackingManager'

describe('New Tracking System - Basic Functionality', () => {
  it('should initialize all tracking services without errors', () => {
    expect(() => {
      // Test that services exist and can be imported
      expect(TrackingLogger).toBeDefined()
      expect(AppLifecycleManager).toBeDefined()
      expect(TrackingManager).toBeDefined()

      // Test main methods
      expect(typeof TrackingLogger.info).toBe('function')
      expect(typeof AppLifecycleManager.getDebugInfo).toBe('function')
      expect(typeof TrackingManager.getDebugInfo).toBe('function')
    }).not.toThrow()
  })

  it('should have proper logging functionality', () => {
    // Mock console methods to avoid console-fail-test errors
    const originalConsoleLog = global.console.log
    const originalConsoleError = global.console.error
    // eslint-disable-next-line no-console
    global.console.log = jest.fn()
    // eslint-disable-next-line no-console
    global.console.error = jest.fn()

    try {
      // Test logging sans erreur
      expect(() => {
        TrackingLogger.info('TEST', { message: 'test' })
        TrackingLogger.error('TEST', { message: 'test' })
      }).not.toThrow()

      // Test log retrieval
      const logs = TrackingLogger.getLogs()

      expect(Array.isArray(logs)).toBe(true)
    } finally {
      // Restore console methods
      // eslint-disable-next-line no-console
      global.console.log = originalConsoleLog
      // eslint-disable-next-line no-console
      global.console.error = originalConsoleError
    }
  })

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
