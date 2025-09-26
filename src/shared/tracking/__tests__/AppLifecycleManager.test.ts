/**
 * Simplified unit tests for AppLifecycleManager
 * Focus on essential functionality without complex mocking
 */

import { AppState } from 'react-native'

import { AppLifecycleManager } from '../AppLifecycleManager'

// Mock only external dependencies
jest.mock('react-native', () => ({
  AppState: {
    currentState: 'active',
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}))

// Silence console output
const originalConsole = { ...console }

beforeAll(() => {
  global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
  }
})

afterAll(() => {
  global.console = originalConsole
})

describe('AppLifecycleManager (Essential)', () => {
  let mockAppStateListener: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockAppStateListener = jest.fn()
    ;(AppState.addEventListener as jest.Mock).mockImplementation((event, callback) => {
      if (event === 'change') {
        mockAppStateListener = callback
      }
      return { remove: jest.fn() }
    })

    // Reset singleton
    AppLifecycleManager.__resetForTesting()
  })

  describe('Basic Functionality', () => {
    it('should initialize successfully', () => {
      const manager = AppLifecycleManager
      manager.initialize()

      const debugInfo = manager.getDebugInfo()

      expect(debugInfo.isInitialized).toBe(true)
      expect(debugInfo.currentAppState).toBe('active')
    })

    it('should register and manage pages', () => {
      const manager = AppLifecycleManager
      manager.initialize()

      const handler = jest.fn()
      manager.registerPage('page1', handler)

      const debugInfo = manager.getDebugInfo()

      expect(debugInfo.registeredPages).toContain('page1')
      expect(debugInfo.registeredPages).toHaveLength(1)
    })

    it('should set active page correctly', () => {
      const manager = AppLifecycleManager
      manager.initialize()

      const handler = jest.fn()
      manager.registerPage('page1', handler)
      manager.setActivePage('page1')

      const debugInfo = manager.getDebugInfo()

      expect(debugInfo.activePageId).toBe('page1')
    })

    it('should notify only active page of events', () => {
      const manager = AppLifecycleManager
      manager.initialize()

      const handler1 = jest.fn()
      const handler2 = jest.fn()

      manager.registerPage('page1', handler1)
      manager.registerPage('page2', handler2)
      manager.setActivePage('page1')

      // Simulate AppState change
      mockAppStateListener('background')

      expect(handler1).toHaveBeenCalledWith('page1', 'background')
      expect(handler2).not.toHaveBeenCalled()
    })

    it('should handle unregistration', () => {
      const manager = AppLifecycleManager
      manager.initialize()

      const handler = jest.fn()
      manager.registerPage('page1', handler)
      manager.unregisterPage('page1')

      const debugInfo = manager.getDebugInfo()

      expect(debugInfo.registeredPages).not.toContain('page1')
      expect(debugInfo.registeredPages).toHaveLength(0)
    })

    it('should return same singleton instance', () => {
      const instance1 = AppLifecycleManager
      const instance2 = AppLifecycleManager

      expect(instance1).toBe(instance2)
    })
  })

  describe('AppState Events', () => {
    it('should handle background transition', () => {
      const manager = AppLifecycleManager
      manager.initialize()

      const handler = jest.fn()
      manager.registerPage('page1', handler)
      manager.setActivePage('page1')

      mockAppStateListener('background')

      expect(handler).toHaveBeenCalledWith('page1', 'background')
    })

    it('should handle foreground transition', () => {
      const manager = AppLifecycleManager
      manager.initialize()

      const handler = jest.fn()
      manager.registerPage('page1', handler)
      manager.setActivePage('page1')

      // First go to background
      mockAppStateListener('background')
      jest.clearAllMocks()

      // Then back to active
      mockAppStateListener('active')

      expect(handler).toHaveBeenCalledWith('page1', 'foreground')
    })

    it('should ignore same state transitions', () => {
      const manager = AppLifecycleManager
      manager.initialize()

      const handler = jest.fn()
      manager.registerPage('page1', handler)
      manager.setActivePage('page1')

      mockAppStateListener('active') // Same as current

      expect(handler).not.toHaveBeenCalled()
    })
  })
})
