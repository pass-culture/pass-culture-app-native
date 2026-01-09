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

  // Web lifecycle tests require jsdom environment
  // These tests verify web-specific functionality
  describe('Web Lifecycle Events', () => {
    // Skip if not in browser-like environment
    const hasDocument = typeof document !== 'undefined'
    const describeFn = hasDocument ? describe : describe.skip

    describeFn('when in browser environment', () => {
      let documentAddEventListenerSpy: jest.SpyInstance
      let windowAddEventListenerSpy: jest.SpyInstance
      let visibilityChangeHandler: () => void
      let pageHideHandler: (event: PageTransitionEvent) => void
      let beforeUnloadHandler: (event: BeforeUnloadEvent) => void

      beforeEach(() => {
        // Setup document.visibilityState mock
        Object.defineProperty(document, 'visibilityState', {
          value: 'visible',
          writable: true,
          configurable: true,
        })

        // Capture event handlers
        documentAddEventListenerSpy = jest
          .spyOn(document, 'addEventListener')
          .mockImplementation((event: string, handler: EventListenerOrEventListenerObject) => {
            if (event === 'visibilitychange') {
              visibilityChangeHandler = handler as () => void
            }
          })

        windowAddEventListenerSpy = jest
          .spyOn(window, 'addEventListener')
          .mockImplementation((event: string, handler: EventListenerOrEventListenerObject) => {
            if (event === 'pagehide') {
              pageHideHandler = handler as (event: PageTransitionEvent) => void
            } else if (event === 'beforeunload') {
              beforeUnloadHandler = handler as (event: BeforeUnloadEvent) => void
            }
          })

        // Reset singleton
        AppLifecycleManager.__resetForTesting()
      })

      afterEach(() => {
        documentAddEventListenerSpy?.mockRestore()
        windowAddEventListenerSpy?.mockRestore()
      })

      it('should attach web listeners when window is defined', () => {
        const manager = AppLifecycleManager
        manager.initialize()

        expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
          'visibilitychange',
          expect.any(Function)
        )
        expect(windowAddEventListenerSpy).toHaveBeenCalledWith('pagehide', expect.any(Function))
        expect(windowAddEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))
      })

      it('should not attach web listeners multiple times', () => {
        const manager = AppLifecycleManager
        manager.initialize()
        manager.initialize() // Second call

        // Should only be called once for each event
        expect(
          documentAddEventListenerSpy.mock.calls.filter((call) => call[0] === 'visibilitychange')
        ).toHaveLength(1)
      })

      it('should trigger background event on visibilitychange to hidden', () => {
        const manager = AppLifecycleManager
        manager.initialize()

        const handler = jest.fn()
        manager.registerPage('page1', handler)
        manager.setActivePage('page1')

        // Simulate visibility change to hidden
        Object.defineProperty(document, 'visibilityState', {
          value: 'hidden',
          writable: true,
          configurable: true,
        })
        visibilityChangeHandler()

        expect(handler).toHaveBeenCalledWith('page1', 'background')
      })

      it('should trigger foreground event on visibilitychange to visible', () => {
        const manager = AppLifecycleManager
        manager.initialize()

        const handler = jest.fn()
        manager.registerPage('page1', handler)
        manager.setActivePage('page1')

        // First go to hidden
        Object.defineProperty(document, 'visibilityState', {
          value: 'hidden',
          writable: true,
          configurable: true,
        })
        visibilityChangeHandler()
        jest.clearAllMocks()

        // Then back to visible
        Object.defineProperty(document, 'visibilityState', {
          value: 'visible',
          writable: true,
          configurable: true,
        })
        visibilityChangeHandler()

        expect(handler).toHaveBeenCalledWith('page1', 'foreground')
      })

      it('should trigger background event on pagehide', () => {
        const manager = AppLifecycleManager
        manager.initialize()

        const handler = jest.fn()
        manager.registerPage('page1', handler)
        manager.setActivePage('page1')

        // Simulate pagehide event
        const event = { persisted: false } as PageTransitionEvent
        pageHideHandler(event)

        expect(handler).toHaveBeenCalledWith('page1', 'background')
      })

      it('should trigger background event on beforeunload', () => {
        const manager = AppLifecycleManager
        manager.initialize()

        const handler = jest.fn()
        manager.registerPage('page1', handler)
        manager.setActivePage('page1')

        // Simulate beforeunload event
        const event = {} as BeforeUnloadEvent
        beforeUnloadHandler(event)

        expect(handler).toHaveBeenCalledWith('page1', 'background')
      })

      it('should include web status in debug info', () => {
        const manager = AppLifecycleManager
        manager.initialize()

        const debugInfo = manager.getDebugInfo()

        expect(debugInfo).toHaveProperty('webListenersAttached', true)
        expect(debugInfo).toHaveProperty('lastVisibilityState', 'visible')
      })

      it('should not throw when web event fires with no active page', () => {
        const manager = AppLifecycleManager
        manager.initialize()

        // No page registered, no active page
        // Should not throw
        expect(() => {
          Object.defineProperty(document, 'visibilityState', {
            value: 'hidden',
            writable: true,
            configurable: true,
          })
          visibilityChangeHandler()
        }).not.toThrow()
      })

      it('should not throw when web event fires after page unregistered', () => {
        const manager = AppLifecycleManager
        manager.initialize()

        const handler = jest.fn()
        manager.registerPage('page1', handler)
        manager.setActivePage('page1')
        manager.unregisterPage('page1')

        // Page was unregistered but is still set as active
        // Should not throw
        expect(() => {
          Object.defineProperty(document, 'visibilityState', {
            value: 'hidden',
            writable: true,
            configurable: true,
          })
          visibilityChangeHandler()
        }).not.toThrow()

        expect(handler).not.toHaveBeenCalled()
      })

      it('should catch and handle errors thrown by page handler', () => {
        const manager = AppLifecycleManager
        manager.initialize()

        const errorHandler = jest.fn(() => {
          throw new Error('Handler error')
        })
        manager.registerPage('page1', errorHandler)
        manager.setActivePage('page1')

        // Should not throw even if handler throws
        expect(() => {
          Object.defineProperty(document, 'visibilityState', {
            value: 'hidden',
            writable: true,
            configurable: true,
          })
          visibilityChangeHandler()
        }).not.toThrow()

        expect(errorHandler).toHaveBeenCalledWith('page1', 'background')
      })

      it('should remove web listeners on reset', () => {
        const documentRemoveEventListenerSpy = jest.spyOn(document, 'removeEventListener')
        const windowRemoveEventListenerSpy = jest.spyOn(globalThis.window, 'removeEventListener')

        const manager = AppLifecycleManager
        manager.initialize()

        manager.__resetForTesting()

        expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
          'visibilitychange',
          expect.any(Function)
        )
        expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith('pagehide', expect.any(Function))
        expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(
          'beforeunload',
          expect.any(Function)
        )

        documentRemoveEventListenerSpy.mockRestore()
        windowRemoveEventListenerSpy.mockRestore()
      })

      it('should reset web-specific properties on reset', () => {
        const manager = AppLifecycleManager
        manager.initialize()

        // Verify web listeners are attached
        let debugInfo = manager.getDebugInfo()

        expect(debugInfo.webListenersAttached).toBe(true)

        manager.__resetForTesting()

        debugInfo = manager.getDebugInfo()

        expect(debugInfo.webListenersAttached).toBe(false)
        expect(debugInfo.lastVisibilityState).toBe(null)
      })

      it('should handle pagehide with persisted flag', () => {
        const manager = AppLifecycleManager
        manager.initialize()

        const handler = jest.fn()
        manager.registerPage('page1', handler)
        manager.setActivePage('page1')

        // Simulate pagehide with persisted=true (bfcache)
        const event = { persisted: true } as PageTransitionEvent
        pageHideHandler(event)

        expect(handler).toHaveBeenCalledWith('page1', 'background')
      })
    })

    // Test that web status is correctly reported based on environment
    it('should correctly report web listener status based on environment', () => {
      const manager = AppLifecycleManager
      manager.initialize()

      const debugInfo = manager.getDebugInfo()

      // webListenersAttached should match whether document is defined
      const expectedAttached = typeof document !== 'undefined'

      expect(debugInfo.webListenersAttached).toBe(expectedAttached)
    })
  })
})
